import api from "@/app/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 👇 NUEVO
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");

      // 👉 Entraron directo sin login
      if (!token) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);

      } catch {
        await AsyncStorage.removeItem("token");
        setUnauthorized(true);

      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 👉 pantalla NO AUTORIZADO
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

  // 👉 mientras valida token
  if (loading || !user) return null;

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
