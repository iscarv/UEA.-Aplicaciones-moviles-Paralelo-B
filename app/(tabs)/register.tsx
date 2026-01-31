// ================= IMPORTS =================

// React + hooks
import React, { useRef, useState } from "react";

// Componentes React Native
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Cliente axios configurado
import api from "@/app/services/api";

// Selector de rol
import { Picker } from "@react-native-picker/picker";

// Navegación Expo Router
import { useRouter } from "expo-router";

// Zod para validaciones
import { z } from "zod";

/*
================= ESQUEMA ZOD =================

✔ Validación por campo
✔ Longitud mínima contraseña
✔ Confirmación obligatoria
✔ Validación cruzada
*/

const registerSchema = z
  .object({
    name: z.string().min(1, "Ingrese su nombre"),

    email: z.string().email("Correo inválido"),

    password: z
      .string()
      .min(6, "La contraseña debe tener mínimo 6 caracteres"),

    confirmPassword: z
      .string()
      .min(6, "Debe confirmar la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

/*
================= COMPONENTE =================
*/

export default function Register() {
  const router = useRouter();

  // Estados
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState(1);
  const [success, setSuccess] = useState(false);

  // ================= REFS PARA MOVER FOCO =================

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  // ================= DEBOUNCE =================
  // En Expo se usa number, NO NodeJS.Timeout

  const emailTimer = useRef<number | null>(null);

  /*
    Validación asíncrona del correo con debounce

    ✔ espera 600ms
    ✔ cancela llamadas previas
  */
  const checkEmail = (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (emailTimer.current) clearTimeout(emailTimer.current);

      emailTimer.current = setTimeout(async () => {
        const res = await api.get(`/auth/check-email/${email}`);
        resolve(res.data.exists);
      }, 600);
    });
  };

  /*
================= REGISTRO =================
*/

  const register = async () => {
    setSuccess(false);

    // Ejecuta validación Zod
    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    // Error → mover foco al primer campo inválido
    if (!result.success) {
      const field = result.error.issues[0].path[0];

      if (field === "name") nameRef.current?.focus();
      if (field === "email") emailRef.current?.focus();
      if (field === "password") passwordRef.current?.focus();
      if (field === "confirmPassword") confirmRef.current?.focus();

      Alert.alert("Error", result.error.issues[0].message);
      return;
    }

    // Validación asíncrona del correo
    const exists = await checkEmail(email);

    if (exists) {
      emailRef.current?.focus();
      Alert.alert("Error", "Correo ya registrado");
      return;
    }

    // Formatea nombre
    const formattedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    try {
      await api.post("/auth/register", {
        name: formattedName,
        email: email.toLowerCase(),
        password,
        role_id: roleId,
      });

      setSuccess(true);

      // Limpia formulario
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRoleId(1);
    } catch {
      Alert.alert("Error", "No se pudo registrar");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Registro</Text>

        {success && (
          <Text style={styles.success}>
            Usuario registrado correctamente. Inicie sesión.
          </Text>
        )}

        {/* NOMBRE */}
        <TextInput
          ref={nameRef}
          placeholder="Nombre"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          value={name}
          onChangeText={(text) =>
            setName(text.charAt(0).toUpperCase() + text.slice(1))
          }
          style={styles.input}
        />

        {/* CORREO */}
        <TextInput
          ref={emailRef}
          placeholder="Correo"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
          style={styles.input}
        />

        {/* CONTRASEÑA */}
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

        {/* CONFIRMAR */}
        <TextInput
          ref={confirmRef}
          placeholder="Confirmar contraseña"
          secureTextEntry
          returnKeyType="done"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />

        <Text style={styles.label}>Rol</Text>

        <View style={styles.pickerBox}>
          <Picker selectedValue={roleId} onValueChange={setRoleId}>
            <Picker.Item label="Usuario" value={1} />
            <Picker.Item label="Administrador" value={2} />
          </Picker>
        </View>

        <Button title="Registrarse" color="#e75480" onPress={register} />

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.link}>Volver al login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/*
================= ESTILOS =================
*/

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

  link: {
    color: "#e75480",
    textAlign: "center",
    marginTop: 15,
  },
});
