import api from "@/app/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Pantalla de Login
export default function Login() {
  const router = useRouter();

  // Estado del correo
  const [email, setEmail] = useState("");
  // Estado de la contraseña
  const [password, setPassword] = useState("");

  // Función de inicio de sesión
  const login = async () => {
    // Validación básica: campos vacíos
    if (!email.trim() || !password.trim()) {
      Alert.alert("Aviso", "Ingrese sus credenciales");
      return;
    }

    try {
      // Petición al backend para autenticar usuario
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),  // correo siempre en minúsculas
        password,
      });

      // Guarda el token JWT localmente (persistencia de sesión)
      await AsyncStorage.setItem("token", res.data.token);

      // Redirige a la vista protegida Home
      router.replace("/home");

    } catch (error: any) {
       // Obtiene mensaje del backend
      const msg = error.response?.data?.message;

      // Mensajes personalizados según el error
      if (msg?.toLowerCase().includes("correo")) {
        Alert.alert("Error", "Usuario incorrecto");
      } else if (msg?.toLowerCase().includes("contraseña")) {
        Alert.alert("Error", "Contraseña incorrecta");
      } else {
        Alert.alert("Error", "Credenciales inválidas");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>BookNotes</Text>

        {/* CORREO – siempre minúsculas */}
        <TextInput
          placeholder="Correo"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
          style={styles.input}
        />

        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <Button title="Ingresar" color="#e75480" onPress={login} />

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>Crear cuenta</Text>
        </TouchableOpacity>
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

