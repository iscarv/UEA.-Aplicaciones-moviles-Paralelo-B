// ================= IMPORTS =================
import api from "@/app/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

/*
  Pantalla protegida Home

  Funciones principales:
  - Solo usuarios autenticados pueden acceder
  - Valida token y expiración guardada en AsyncStorage
  - Permite cerrar sesión
*/
export default function Home() {
  const router = useRouter();

  // Datos del usuario autenticado
  const [user, setUser] = useState<any>(null);

  // Controla carga inicial
  const [loading, setLoading] = useState(true);

  // Controla acceso no autorizado
  const [unauthorized, setUnauthorized] = useState(false);

  // ================= VALIDACIÓN TOKEN =================
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
          // Token expirado o inválido → limpiar AsyncStorage
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("token_expires");
          setUnauthorized(true);
          return;
        }

        // ================= PETICIÓN /auth/me =================
        try {
          const res = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (err) {
          console.error("Token inválido o error en /auth/me:", err);
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("token_expires");
          setUnauthorized(true);
        }
      } catch (err) {
        console.error("Error verificando token:", err);
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ================= VISTA NO AUTORIZADO =================
  if (unauthorized) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>BookNotes 📚</Text>
          <Text style={{ marginBottom: 15 }}>Introduzca sus credenciales</Text>
          <Button
            title="Iniciar sesión"
            color="#e75480"
            onPress={() => router.replace("/login")}
          />
        </View>
      </View>
    );
  }

  // Mientras valida token o carga usuario
  if (loading || !user) return null;

  // ================= FUNCION LOGOUT =================
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("token_expires");
    router.replace("/login");
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

// ================= ESTILOS =================
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