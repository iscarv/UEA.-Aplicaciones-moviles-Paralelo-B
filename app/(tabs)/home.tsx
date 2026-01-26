import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import api from "../services/api";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return router.replace("/"); // redirige a login

      try {
        const response = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        Alert.alert("Error", "Sesión expirada o usuario no válido");
        router.replace("/");
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a BookNotes</Text>
      {user && (
        <>
          <Text style={styles.userInfo}>Nombre: {user.name}</Text>
          <Text style={styles.userInfo}>Correo: {user.email}</Text>
        </>
      )}
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  userInfo: { fontSize: 18, marginBottom: 10 },
});
