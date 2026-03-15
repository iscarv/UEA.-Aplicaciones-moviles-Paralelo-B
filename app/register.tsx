// ================= IMPORTS =================

// API para conectar con el backend
import api from "@/services/api";

// Selector de rol
import { Picker } from "@react-native-picker/picker";

// Navegación con Expo Router
import { useRouter } from "expo-router";

// Hooks de React
import React, { useRef, useState } from "react";

// Componentes de React Native
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Librería de validación
import { z } from "zod";


// ================= ESQUEMA DE VALIDACIÓN =================

/*
  Validación del formulario con Zod

  - Nombre obligatorio
  - Email válido
  - Password mínimo 6 caracteres
  - Confirmación de contraseña igual
*/

const registerSchema = z
  .object({
    name: z.string().min(1, "Ingrese su nombre"),
    email: z.string().email("Correo inválido"),
    password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Debe confirmar la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });


// ================= COMPONENTE PRINCIPAL =================

export default function Register() {

  // Router para navegar entre pantallas
  const router = useRouter();

  // ================= ESTADOS =================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [roleId, setRoleId] = useState(1);
  const [success, setSuccess] = useState(false);


  // ================= REFS =================
  // Permiten mover el foco automáticamente entre inputs

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);


  // ================= FUNCIÓN REGISTRAR =================

  const register = async () => {

    setSuccess(false);

    // ================= VALIDACIÓN =================

    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    // Si la validación falla
    if (!result.success) {

      const field = result.error.issues[0].path[0];

      // Mover foco al campo incorrecto
      if (field === "name") nameRef.current?.focus();
      if (field === "email") emailRef.current?.focus();
      if (field === "password") passwordRef.current?.focus();
      if (field === "confirmPassword") confirmRef.current?.focus();

      Alert.alert("Error", result.error.issues[0].message);
      return;
    }

    // ================= FORMATEO DE DATOS =================

    /*
      Se formatea el nombre para garantizar
      que siempre se guarde correctamente.
    */

    const formattedName =
      name.trim().charAt(0).toUpperCase() +
      name.trim().slice(1).toLowerCase();

    const formattedEmail = email.trim().toLowerCase();


    try {

      // ================= PETICIÓN AL BACKEND =================

      await api.post("/auth/register", {
        name: formattedName,
        email: formattedEmail,
        password,
        role_id: roleId,
      });

      // ================= REGISTRO EXITOSO =================

      setSuccess(true);

      Alert.alert(
        "Registrado",
        "Usuario registrado correctamente. Ahora puede iniciar sesión.",
        [
          {
            text: "Ir a Login",
            onPress: () => router.replace("/login"),
          },
        ]
      );

      // ================= LIMPIAR FORMULARIO =================

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRoleId(1);

    } catch (err: any) {

      console.error("Error registro:", err);

      Alert.alert(
        "Error",
        err.response?.data?.message ||
        "No se pudo registrar el usuario"
      );
    }
  };


  // ================= UI =================

  return (
    <View style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.title}>Registro</Text>

        {/* Mensaje visual de éxito */}
        {success && (
          <Text style={styles.success}>
            Usuario registrado correctamente
          </Text>
        )}

        {/* ================= INPUT NOMBRE ================= */}

        <TextInput
          ref={nameRef}
          placeholder="Nombre"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          value={name}

          /*
            Capitaliza automáticamente
            la primera letra mientras escribe
          */
          onChangeText={(text) =>
            setName(text.charAt(0).toUpperCase() + text.slice(1))
          }

          style={styles.input}
        />

        {/* ================= INPUT EMAIL ================= */}

        <TextInput
          ref={emailRef}
          placeholder="Correo"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          value={email}

          // Guardar siempre en minúsculas
          onChangeText={(text) => setEmail(text.toLowerCase())}

          style={styles.input}
        />

        {/* ================= INPUT PASSWORD ================= */}

        <TextInput
          ref={passwordRef}
          placeholder="Contraseña"
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {/* ================= CONFIRM PASSWORD ================= */}

        <TextInput
          ref={confirmRef}
          placeholder="Confirmar contraseña"
          secureTextEntry
          returnKeyType="done"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />

        {/* ================= SELECT ROL ================= */}

        <Text style={styles.label}>Rol</Text>

        <View style={styles.pickerBox}>
          <Picker
            selectedValue={roleId}
            onValueChange={(value) => setRoleId(value)}
          >
            <Picker.Item label="Usuario" value={1} />
            <Picker.Item label="Administrador" value={2} />
          </Picker>
        </View>

        {/* ================= BOTÓN REGISTRARSE ================= */}

        <TouchableOpacity style={styles.button} onPress={register}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        {/* ================= VOLVER LOGIN ================= */}

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.link}>Volver al login</Text>
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
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#e75480",
  },

  success: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },

  label: {
    marginBottom: 5,
  },

  pickerBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#e75480",
    paddingVertical: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  link: {
    color: "#e75480",
    textAlign: "center",
    marginTop: 15,
  },

});