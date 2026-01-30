import api from "@/app/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

// Pantalla protegida Home
export default function Home() {
  const router = useRouter();

  // Estado del usuario autenticado
  const [user, setUser] = useState<any>(null);
  // Estado de carga mientras se valida el token
  const [loading, setLoading] = useState(true);

   // Estado para controlar acceso no autorizado
  const [unauthorized, setUnauthorized] = useState(false);

  // Se ejecuta al cargar la pantalla
  useEffect(() => {
    const checkAuth = async () => {
      // Obtiene token guardado
      const token = await AsyncStorage.getItem("token");

      // Si no hay token, bloquear acceso
      if (!token) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      try {
        // Consulta al backend para obtener datos del usuario
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Guarda datos del usuario
        setUser(res.data);

      } catch {
        // Si el token falla se elimina y se bloquea acceso
        await AsyncStorage.removeItem("token");
        setUnauthorized(true);

      } finally {
        // Finaliza carga
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Vista cuando el usuario no está autenticado
  if (unauthorized) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>BookNotes 📚</Text>

          <Text style={{ marginBottom: 15 }}>
            Introduzca sus credenciales
          </Text>

          <Button
            title="Iniciar sesión"
            color="#e75480"
            onPress={() => router.replace("/")}
          />
        </View>
      </View>
    );
  }

  // Mientras se valida token no se muestra nada
  if (loading || !user) return null;

  // Cerrar sesión: elimina token y regresa al login
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>BookNotes 📚</Text>

        <Text style={styles.text}>Bienvenid@ {user.name}</Text>

        <Text style={styles.sub}>Correo: {user.email}</Text>

        <Text style={styles.sub}>
          Rol: {user.role_id === 2 ? "Administrador" : "Usuario"}
        </Text>

        <Button title="Cerrar sesión" color="#e75480" onPress={logout} />
      </View>
    </View>
  );
}

// Estilos de la pantalla
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
});
