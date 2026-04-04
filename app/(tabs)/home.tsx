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
import { Button, Platform, StyleSheet, Text, View } from "react-native";

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
  const [activeBook, setActiveBook] = useState<any>(null);
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
  // CARGAR LIBRO ACTIVO
  // =====================================================
  useEffect(() => {
    const loadActiveBook = async () => {
      if (!user) return;
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await api.get("/books", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const books: any[] = res.data;
        const active = books.find(b => b.status === "Leyendo");
        setActiveBook(active || null);

        // Web reminder banner
        if (Platform.OS === "web" && active) {
          setShowWebReminder(true);
        }

        // Móvil: programar notificación
        if (Platform.OS !== "web" && active) {
          scheduleDailyNotification(active.title);
        }

      } catch (err) {
        console.error("❌ Error cargando libro activo:", err);
      }
    };
    loadActiveBook();
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
  const scheduleDailyNotification = async (bookTitle: string) => {
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

    // Crear trigger de calendario usando SchedulableTriggerInputTypes
    const trigger: Notifications.CalendarTriggerInput = {
      type: SchedulableTriggerInputTypes.CALENDAR,
      hour: 20,
      minute: 0,
      repeats: true,
    };

    // Programar notificación
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 Tiempo de lectura',
        body: `¡Continúa leyendo "${bookTitle}" hoy!`,
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
        {showWebReminder && activeBook && (
          <View style={styles.webReminder}>
            <Text>📖 ¡No olvides continuar con tu libro "{activeBook.title}"!</Text>
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