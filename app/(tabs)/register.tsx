import api from "@/app/services/api";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
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
  const [roleId, setRoleId] = useState(1);

  // 👇 MENSAJE VISUAL DE ÉXITO (web + móvil)
  const [success, setSuccess] = useState(false);

  const register = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const formattedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    try {
      await api.post("/auth/register", {
        name: formattedName,
        email: email.toLowerCase(),
        password,
        role_id: roleId,
      });

      // 👇 activar mensaje verde
      setSuccess(true);

      // opcional: limpiar campos
      setName("");
      setEmail("");
      setPassword("");
      setRoleId(1);

    } catch (error: any) {
      console.log(error.response?.data || error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudo registrar"
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fde2ea",
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 12,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10,
            color: "#e75480",
          }}
        >
          Registro
        </Text>

        {/* 👇 MENSAJE VERDE */}
        {success && (
          <Text style={{ color: "green", textAlign: "center", marginBottom: 10 }}>
            Usuario registrado correctamente. Inicie sesión.
          </Text>
        )}

        {/* Nombre */}
        <TextInput
          placeholder="Nombre"
          value={name}
          onChangeText={(text) =>
            setName(text.charAt(0).toUpperCase() + text.slice(1))
          }
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            borderRadius: 6,
            marginBottom: 10,
          }}
        />

        {/* Correo */}
        <TextInput
          placeholder="Correo"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            borderRadius: 6,
            marginBottom: 10,
          }}
        />

        {/* Contraseña */}
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            borderRadius: 6,
            marginBottom: 10,
          }}
        />

        <Text style={{ marginBottom: 5 }}>Rol</Text>

        <View
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 6,
            marginBottom: 15,
          }}
        >
          <Picker selectedValue={roleId} onValueChange={setRoleId}>
            <Picker.Item label="Usuario" value={1} />
            <Picker.Item label="Administrador" value={2} />
          </Picker>
        </View>

        <Button title="Registrarse" color="#e75480" onPress={register} />

        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text
            style={{
              textAlign: "center",
              marginTop: 15,
              color: "#e75480",
            }}
          >
            Volver al login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
