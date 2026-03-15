// ================= IMPORTS =================

// Cliente API para consumir el backend
import api from "@/services/api";

// Permite guardar datos localmente (token, expiración, etc.)
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hook de navegación de Expo Router
import { useRouter } from "expo-router";

// Hooks de React
import { useEffect, useState } from "react";

// Componentes de interfaz de React Native
import { Button, StyleSheet, Text, View } from "react-native";

/*
========================================================
PANTALLA PROTEGIDA HOME
========================================================

Funciones principales:

✔ Solo usuarios autenticados pueden acceder
✔ Valida token JWT guardado en AsyncStorage
✔ Consulta endpoint protegido /auth/me
✔ Permite cerrar sesión
✔ Permite navegar a la pantalla para agregar libros
  donde se usará cámara y sistema de archivos
*/

export default function Home() {

  // Hook de navegación
  const router = useRouter();

  // Estado que almacenará los datos del usuario autenticado
  const [user, setUser] = useState<any>(null);

  // Controla la carga inicial mientras se valida el token
  const [loading, setLoading] = useState(true);

  // Indica si el usuario no está autorizado
  const [unauthorized, setUnauthorized] = useState(false);



  // =====================================================
  // VALIDACIÓN DEL TOKEN JWT
  // =====================================================
  useEffect(() => {

    const checkAuth = async () => {

      try {

        // Obtener token guardado
        const token = await AsyncStorage.getItem("token");

        // Obtener fecha de expiración
        const expiresStr = await AsyncStorage.getItem("token_expires");

        // Si no existe token o expiración → no autorizado
        if (!token || !expiresStr) {
          setUnauthorized(true);
          return;
        }

        const expires = parseInt(expiresStr, 10);

        // Si expiró el token → limpiar almacenamiento
        if (isNaN(expires) || Date.now() > expires) {

          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("token_expires");

          setUnauthorized(true);
          return;
        }



        // =================================================
        // PETICIÓN AL ENDPOINT PROTEGIDO /auth/me
        // =================================================
        try {

          const res = await api.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          // Guardar datos del usuario
          setUser(res.data);

        } catch (err) {

          console.error("Token inválido o error en /auth/me:", err);

          // Si el token no es válido → limpiar sesión
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



  // =====================================================
  // VISTA DE USUARIO NO AUTORIZADO
  // =====================================================
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
            onPress={() => router.replace("/login")}
          />

        </View>
      </View>
    );
  }



  // Mientras se valida el token
  if (loading || !user) return null;



  // =====================================================
  // FUNCIÓN LOGOUT
  // =====================================================
  const logout = async () => {

    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("token_expires");

    router.replace("/login");

  };



  // =====================================================
  // INTERFAZ PRINCIPAL HOME
  // =====================================================
  return (

    <View style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.title}>BookNotes 📚</Text>

        {/* Información del usuario */}
        <Text style={styles.text}>Bienvenid@ {user.name}</Text>

        <Text style={styles.sub}>
          Correo: {user.email}
        </Text>

        <Text style={styles.sub}>
          Rol: {user.role_id === 2 ? "Administrador" : "Usuario"}
        </Text>



        {/* ===============================================
           BOTÓN PARA IR A AGREGAR LIBRO
           Aquí se probarán:

           - Cámara
           - Sistema de archivos
        =============================================== */}
        <Button
          title="Agregar libro"
          onPress={() => router.push("/(tabs)/add-book")}
        />



        {/* Espacio visual */}
        <View style={{ height: 10 }} />



        {/* Botón cerrar sesión */}
        <Button
          title="Cerrar sesión"
          color="#e75480"
          onPress={logout}
        />

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

});