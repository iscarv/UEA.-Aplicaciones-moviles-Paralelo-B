// Importa la instancia configurada de axios para consumir el backend
import api from "@/app/services/api";
// Selector desplegable para elegir el rol
import { Picker } from "@react-native-picker/picker";
// Hook de navegación de Expo Router
import { useRouter } from "expo-router";
// Importa React y el hook useState para manejar estados
import React, { useState } from "react";
// Componentes visuales básicos de React Native
import {
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  // Inicializa el router para poder navegar entre pantallas
  const router = useRouter();

  // Estados para almacenar los valores del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(1);

  // Estado que controla el mensaje visual de registro exitoso
  const [success, setSuccess] = useState(false);

  // Función que se ejecuta al presionar el botón "Registrarse"
  const register = async () => {
    // Validación básica: verifica que ningún campo esté vacío
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    // Formatea el nombre para que empiece con mayúscula
    const formattedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    try {
      // Envía los datos del usuario al backend para registrarlo
      await api.post("/auth/register", {
        name: formattedName,
        email: email.toLowerCase(),
        password,
        role_id: roleId,
      });

      // Activa el mensaje verde indicando que el registro fue exitoso
      setSuccess(true);

      // Limpia los campos después del registro
      setName("");
      setEmail("");
      setPassword("");
      setRoleId(1);

    } catch (error: any) {
      // Muestra errores provenientes del servidor
      console.log(error.response?.data || error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudo registrar"
      );
    }
  };

  return (
    // Contenedor principal centrado en pantalla
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fde2ea",
      }}
    >
      {/* Tarjeta blanca que contiene el formulario */}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 12,
          elevation: 5,
        }}
      >

        {/* Título de la pantalla */}
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

        {/* Mensaje verde que aparece al registrarse correctamente */}
        {success && (
          <Text style={{ color: "green", textAlign: "center", marginBottom: 10 }}>
            Usuario registrado correctamente. Inicie sesión.
          </Text>
        )}

        {/* Campo de entrada para el nombre */}
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

        {/* Campo de entrada para el correo */}
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

        {/* Campo de entrada para la contraseña */}
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

      {/* Texto informativo del selector de rol */}
        <Text style={{ marginBottom: 5 }}>Rol</Text>

      {/* Selector desplegable para elegir el rol del usuario */}
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

       {/* Botón que ejecuta la función de registro */}
        <Button title="Registrarse" color="#e75480" onPress={register} />

      {/* Enlace para volver a la pantalla de login */}
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
