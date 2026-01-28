import api from "@/app/services/api";
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

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registered, setRegistered] = useState(false);

  const register = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Limpiar campos
      setName("");
      setEmail("");
      setPassword("");

      // Mostrar mensaje en pantalla
      setRegistered(true);

    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al registrar"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      {registered && (
        <Text style={styles.success}>
          ✅ Usuario registrado correctamente. Ahora inicia sesión.
        </Text>
      )}

      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Correo"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button title="Registrarse" onPress={register} />

      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={styles.link}>Ir al login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  link: {
    color: "#007bff",
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});
