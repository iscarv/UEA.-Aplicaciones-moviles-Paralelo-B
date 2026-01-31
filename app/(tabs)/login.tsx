// Cliente API configurado (axios)
import api from "@/app/services/api";

// AsyncStorage para guardar el token de sesión
import AsyncStorage from "@react-native-async-storage/async-storage";

// Navegación con Expo Router
import { useRouter } from "expo-router";

// React y hooks
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

/*
  Pantalla de Login
*/

export default function Login() {
  const router = useRouter();

  // Estado del correo
  const [email, setEmail] = useState("");

  // Estado de la contraseña
  const [password, setPassword] = useState("");

  /*
    Función de inicio de sesión
  */
  const login = async () => {
    // Validación básica: evita enviar campos vacíos
    if (!email.trim() || !password.trim()) {
      Alert.alert("Aviso", "Ingrese sus credenciales");
      return;
    }

    try {
      // Petición al backend
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      // Guarda el token JWT para mantener sesión iniciada
      await AsyncStorage.setItem("token", res.data.token);

      // Redirige a Home cuando el login es exitoso
      router.replace("/home");

    } catch {
      /*
        Si falla el login (correo o contraseña incorrectos):

        👉 Se muestra UN SOLO mensaje genérico.
        Esto es buena práctica porque:
        ✔ no confunde al usuario
        ✔ no revela si el correo existe
        ✔ es más seguro
      */
      Alert.alert("Error", "Correo o contraseña incorrectos");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Título de la app */}
        <Text style={styles.title}>BookNotes</Text>

        {/* Input correo */}
        <TextInput
          placeholder="Correo"
          accessibilityLabel="Correo electrónico"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
          style={styles.input}
        />

        {/* Input contraseña */}
        <TextInput
          placeholder="Contraseña"
          accessibilityLabel="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {/* Botón de ingreso */}
        <Button title="Ingresar" color="#e75480" onPress={login} />

        {/* Link para ir a registro */}
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>Crear cuenta</Text>
        </TouchableOpacity>
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

