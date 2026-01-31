import api from "@/app/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

/*
  Pantalla protegida Home

  Aquí solo entran usuarios autenticados.
  Si no hay token → se muestra botón para ir al login.
*/

export default function Home() {
  const router = useRouter();

  // Datos del usuario autenticado
  const [user, setUser] = useState<any>(null);

  // Controla carga inicial
  const [loading, setLoading] = useState(true);

  // Controla acceso no autorizado
  const [unauthorized, setUnauthorized] = useState(false);

  /*
    Al cargar Home:

    - Lee token
    - Si no existe → acceso denegado
    - Si existe → consulta /auth/me
  */
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");

      // Si no hay token → no autorizado
      if (!token) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      try {
        // Valida token con backend
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);

      } catch {
        // Token inválido → se elimina
        await AsyncStorage.removeItem("token");
        setUnauthorized(true);

      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /*
    Vista cuando NO está autenticado
  */
  if (unauthorized) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>BookNotes 📚</Text>

          <Text style={{ marginBottom: 15 }}>
            Introduzca sus credenciales
          </Text>

          {/* ⚠️ IMPORTANTE:
              NUNCA navegar a "/"
              SIEMPRE directo a /login
          */}
          <Button
            title="Iniciar sesión"
            color="#e75480"
            onPress={() => router.replace("/login")}
          />
        </View>
      </View>
    );
  }

  // Mientras valida token no muestra nada
  if (loading || !user) return null;

  /*
    Cerrar sesión:

    - Borra SOLO el token
    - NO toca seenOnboarding
    - Va directo al login
  */
  const logout = async () => {
    await AsyncStorage.removeItem("token");
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

/* ================= ESTILOS ================= */

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
