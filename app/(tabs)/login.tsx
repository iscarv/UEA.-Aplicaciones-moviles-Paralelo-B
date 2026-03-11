// ================= IMPORTS =================

// Instancia de axios configurada para conectarse al backend
import api from "@/app/services/api";

// AsyncStorage permite guardar datos localmente en el dispositivo
import AsyncStorage from "@react-native-async-storage/async-storage";

// Router de Expo para navegar entre pantallas
import { useRouter } from "expo-router";

// Hooks de React
import React, { useState } from "react";

// Componentes de React Native
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


// ================= COMPONENTE LOGIN =================
export default function Login() {

  // Router para redireccionar entre pantallas
  const router = useRouter();

  // Estados para guardar lo que escribe el usuario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  // ================= FUNCIÓN LOGIN =================
  const login = async () => {

    // -------- Validación campos vacíos --------
    if (!email.trim() || !password.trim()) {
      Alert.alert("Aviso", "Ingrese sus credenciales");
      return;
    }

    // -------- Validación básica del correo --------
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim().toLowerCase())) {
      Alert.alert("Error", "Ingrese un correo válido");
      return;
    }

    try {

      // ================= PETICIÓN AL BACKEND =================
      // Enviamos correo y contraseña al backend
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      // ================= GUARDAR TOKEN =================
      // El backend devuelve un token JWT que identifica al usuario
      const token = res.data.token;

      // Guardamos el token localmente
      await AsyncStorage.setItem("token", token);


      // ================= GUARDAR EXPIRACIÓN =================
      // Guardamos cuándo expira el token (1 hora)
      const tokenExpiry = Date.now() + 3600 * 1000;

      await AsyncStorage.setItem("token_expires", tokenExpiry.toString());


      // ================= REDIRECCIÓN =================
      // Si el login fue correcto enviamos al Home
      // replace evita volver atrás con el botón del celular
      router.replace("/home");


    } catch (error: any) {

      // Mostrar error en consola para debugging
      console.error("Error al iniciar sesión:", error);

      // Mensaje seguro (no revela si el correo existe)
      const msg =
        error.response?.data?.message || "Correo o contraseña incorrectos";

      Alert.alert("Error", msg);
    }
  };



  // ================= INTERFAZ =================
  return (
    <View style={styles.container}>

      <View style={styles.card}>

        {/* Título de la app */}
        <Text style={styles.title}>BookNotes 📚</Text>


        {/* INPUT CORREO */}
        <TextInput
          placeholder="Correo"
          accessibilityLabel="Correo electrónico"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
          style={styles.input}
        />


        {/* INPUT CONTRASEÑA */}
        <TextInput
          placeholder="Contraseña"
          accessibilityLabel="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />


        {/* BOTÓN LOGIN */}
        <Button
          title="Ingresar"
          color="#e75480"
          onPress={login}
        />


        {/* LINK A REGISTRO */}
        <TouchableOpacity
          onPress={() => router.replace("/register")}
        >
          <Text style={styles.link}>
            Crear cuenta
          </Text>
        </TouchableOpacity>

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
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#e75480",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },

  link: {
    color: "#e75480",
    textAlign: "center",
    marginTop: 15,
  },

});