// ================= IMPORTS =================

// Cliente API
import api from "@/services/api";

// AsyncStorage para obtener token
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hooks de React
import { useEffect, useState } from "react";

// Componentes React Native
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

// Expo Router para cambiar el título del header
import { Stack } from "expo-router";


// =====================================================
// PANTALLA ADMINISTRADOR - LISTA DE USUARIOS
// =====================================================

export default function Users() {

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // CARGAR USUARIOS
  // =====================================================

  useEffect(() => {

    const loadUsers = async () => {
      try {

        const token = await AsyncStorage.getItem("token");

        const res = await api.get("/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUsers(res.data);

      } catch (err: any) {

        console.error("❌ Error cargando usuarios:", err);

        // =====================================================
        // DETECTAR ERROR 403 (SOLO ADMIN)
        // =====================================================

        if (err?.response?.status === 403) {
          setError("Acceso solo para administradores");
        } else {
          setError("No se pudieron cargar los usuarios");
        }

      } finally {

        setLoading(false);

      }
    };

    loadUsers();

  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e75480" />
      </View>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }


  // =====================================================
  // INTERFAZ
  // =====================================================

  return (

    <ScrollView style={styles.container}>

      {/* TÍTULO DEL HEADER */}
      <Stack.Screen options={{ title: "Usuarios" }} />

      <Text style={styles.title}>Usuarios registrados</Text>

      {/* CONTADOR DE USUARIOS */}
      <Text style={styles.count}>
        Total de usuarios: {users.length}
      </Text>


      {/* ===== ENCABEZADO TABLA ===== */}

      <View style={styles.tableHeader}>

        <Text style={styles.headerText}>ID</Text>
        <Text style={styles.headerText}>Nombre</Text>
        <Text style={styles.headerText}>Correo</Text>
        <Text style={styles.headerText}>Rol</Text>

      </View>


      {/* ===== FILAS ===== */}

      {users.map((user) => (

        <View key={user.id} style={styles.row}>

          <Text style={styles.cell}>{user.id}</Text>
          <Text style={styles.cell}>{user.name}</Text>
          <Text style={styles.cell}>{user.email}</Text>
          <Text style={styles.cell}>
            {user.role_id === 2 ? "Administrador" : "Usuario"}
          </Text>

        </View>

      ))}

    </ScrollView>

  );
}


// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fde2ea",
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e75480",
    marginBottom: 10,
    textAlign: "center",
  },

  count: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },

  // ===== TABLA =====

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e75480",
    padding: 10,
    borderRadius: 8,
  },

  headerText: {
    flex: 1,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  cell: {
    flex: 1,
    textAlign: "center",
  },

});