// ================= IMPORTS =================

// Cliente API para consumir el backend
import api from "@/services/api";

// Permite guardar datos localmente (token, expiración, etc.)
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hook de navegación de Expo Router
import { useRouter } from "expo-router";

// Hooks de React
import { useCallback, useEffect, useState } from "react";

// Hook para ejecutar efecto al enfocar pantalla
import { useFocusEffect } from "@react-navigation/native";

// Componentes de interfaz de React Native
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";

// Expo Notifications
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

/*
========================================================
PANTALLA PROTEGIDA HOME
========================================================
*/

export default function Home() {

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const [stats, setStats] = useState({ booksThisMonth: 0, booksThisYear: 0 });
  const [activeBooks, setActiveBooks] = useState<any[]>([]); // ahora es un array
  const [showWebReminder, setShowWebReminder] = useState(false);

  // =====================================================
  // CARGAR ESTADÍSTICAS
  // =====================================================
  const loadStats = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${api.defaults.baseURL}/books/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("❌ Error cargando estadísticas:", err);
    }
  };

  // =====================================================
  // VALIDACIÓN DEL TOKEN JWT
  // =====================================================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const expiresStr = await AsyncStorage.getItem("token_expires");
        if (!token || !expiresStr) {
          setUnauthorized(true);
          return;
        }
        const expires = parseInt(expiresStr, 10);
        if (isNaN(expires) || Date.now() > expires) {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("token_expires");
          setUnauthorized(true);
          return;
        }

        try {
          const res = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("token_expires");
          setUnauthorized(true);
        }

      } catch (err) {
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // ================= REFRESCAR ESTADÍSTICAS AL ENFOCAR =================
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  // =====================================================
  // CARGAR LIBROS ACTIVOS
  // =====================================================
  useEffect(() => {
    const loadActiveBooks = async () => {
      if (!user) return;
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await api.get("/books", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const books: any[] = res.data;

        // Filtrar todos los libros en estado "Leyendo"
        const readingBooks = books.filter(b => b.status === "Leyendo");
        setActiveBooks(readingBooks);

        // Web: mostrar banner si hay libros
        if (Platform.OS === "web" && readingBooks.length > 0) {
          setShowWebReminder(true);
        }

        // Móvil: programar notificación con todos los títulos
        if (Platform.OS !== "web" && readingBooks.length > 0) {
          const titles = readingBooks.map(b => b.title).join(", ");
          scheduleDailyNotification(titles);
        }

      } catch (err) {
        console.error("❌ Error cargando libros activos:", err);
      }
    };
    loadActiveBooks();
  }, [user]);

  // =====================================================
  // FUNCIÓN LOGOUT
  // =====================================================
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("token_expires");
    router.replace("/login");
  };

  // =====================================================
  // NOTIFICACIONES
  // =====================================================
  const scheduleDailyNotification = async (bookTitles: string) => {
    // Pedir permisos
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return;

    // Cancelar notificaciones previas
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Hora para prueba
    const now = new Date();
    const targetHour = 22;
    const targetMinute = 36; // hora para probar

    if (Platform.OS === 'android' && __DEV__) {
      // En Expo Go Android: simulamos notificación con alert
      const target = new Date();
      target.setHours(targetHour, targetMinute, 0, 0);
      let delay = target.getTime() - now.getTime();
      if (delay < 0) delay += 24 * 60 * 60 * 1000; // siguiente día
      setTimeout(() => {
        Alert.alert('📚 Tiempo de lectura', `¡Continúa leyendo tus libros: ${bookTitles} hoy!`);
      }, delay);
      return;
    }

    // Trigger real
    const trigger: Notifications.NotificationTriggerInput =
      Platform.OS === 'android'
        ? {
            type: SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 60 * 60 * 24, // cada 24 horas
            repeats: true,
          }
        : {
            type: SchedulableTriggerInputTypes.CALENDAR,
            hour: targetHour,
            minute: targetMinute,
            repeats: true,
          };

    // Programar notificación real
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 Tiempo de lectura',
        body: `¡Continúa leyendo tus libros: ${bookTitles} hoy!`,
      },
      trigger,
    });
  };

  // =====================================================
  // VISTA USUARIO NO AUTORIZADO
  // =====================================================
  if (unauthorized) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>BookNotes 📚</Text>
          <Text style={{ marginBottom: 15 }}>Introduzca sus credenciales</Text>
          <Button title="Iniciar sesión" color="#e75480" onPress={() => router.replace("/login")} />
        </View>
      </View>
    );
  }

  if (loading || !user) return null;

  // =====================================================
  // INTERFAZ PRINCIPAL HOME
  // =====================================================
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>BookNotes 📚</Text>
        <Text style={styles.text}>Bienvenid@ {user.name}</Text>
        <Text style={styles.sub}>Correo: {user.email}</Text>
        <Text style={styles.sub}>Rol: {user.role_id === 2 ? "Administrador" : "Usuario"}</Text>

        {/* ================= ESTADÍSTICAS ================= */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>📊 Tu progreso</Text>
          <Text>Libros leídos este mes: {stats.booksThisMonth}</Text>
          <Text>Libros leídos este año: {stats.booksThisYear}</Text>
        </View>

        <Button title="Agregar libro" onPress={() => router.push("/(tabs)/add-book")} />
        <View style={{ height: 10 }} />
        <Button title="Cerrar sesión" color="#e75480" onPress={logout} />

        {/* Banner recordatorio web */}
        {showWebReminder && activeBooks.length > 0 && (
          <View style={styles.webReminder}>
            <Text>
              📖 ¡No olvides continuar con tus libros: {activeBooks.map(b => `"${b.title}"`).join(", ")}!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// =====================================================
// ESTILOS
// =====================================================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fde2ea",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    elevation: 4,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e75480",
    marginBottom: 15,
  },

  text: {
    fontSize: 18,
    marginBottom: 8,
  },

  sub: {
    marginBottom: 10,
    color: "#555",
  },

  statsContainer: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 2,
    width: "100%",
    alignItems: "center",
  },

  statsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  webReminder: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#e75480",
    borderRadius: 10,
    alignItems: "center",
  },

});