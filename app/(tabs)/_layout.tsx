// ================= IMPORTS =================

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";


/*
====================================================
LAYOUT DE PESTAÑAS (TABS)
====================================================

Este archivo define la navegación inferior
de la aplicación usando pestañas.

Cada pestaña corresponde a una pantalla
ubicada dentro de la carpeta:

app/(tabs)/

Las pestañas permiten cambiar rápidamente
entre las secciones principales de la app.

Además se agregan iconos para mejorar
la experiencia visual del usuario.

Pestañas disponibles:

🏠 Inicio
➕ Agregar libro
📚 Mis libros
⏱ Historial de lecturas recientes
👤 Usuarios (solo administrador)

*/


export default function TabLayout() {

  const [role, setRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // ====================================================
  // OBTENER ROLE DEL TOKEN
  // ====================================================
  useEffect(() => {

    const getUserRole = async () => {

      try {

        const token = await AsyncStorage.getItem("token");

        if (!token) {
          setRole(0);
          setLoading(false);
          return;
        }

        const decoded: any = jwtDecode(token);

        console.log("ROLE DEL TOKEN:", decoded.role);

        setRole(decoded.role);

      } catch (error) {

        console.log("Error obteniendo rol:", error);
        setRole(0);

      } finally {

        setLoading(false);

      }

    };

    getUserRole();

  }, []);


  // ====================================================
  // EVITAR RENDER HASTA SABER EL ROLE
  // ====================================================
  if (loading) {
    return null;
  }


  return (

    <Tabs

      screenOptions={{

        tabBarActiveTintColor: "#e75480",
        tabBarInactiveTintColor: "gray",
        headerShown: true,

      }}

    >

      {/* =========================================
         PESTAÑA INICIO
      ========================================= */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />


      {/* =========================================
         PESTAÑA AGREGAR LIBRO
      ========================================= */}
      <Tabs.Screen
        name="add-book"
        options={{
          title: "Agregar libro",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="add-circle"
              size={size}
              color={color}
            />
          ),
        }}
      />


      {/* =========================================
         PESTAÑA MIS LIBROS
      ========================================= */}
      <Tabs.Screen
        name="my-books"
        options={{
          title: "Mis libros",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="book"
              size={size}
              color={color}
            />
          ),
        }}
      />


      {/* =========================================
         PESTAÑA HISTORIAL
      ========================================= */}
      <Tabs.Screen
        name="recent-books"
        options={{
          title: "Historial",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="time"
              size={size}
              color={color}
            />
          ),
        }}
      />


      {/* =========================================
         PESTAÑA SOLO ADMIN
      ========================================= */}

      <Tabs.Screen
        name="users"
        options={{
          title: "Usuarios",
          href: role === 2 ? "/users" : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="people"
              size={size}
              color={color}
            />
          ),
        }}
      />

    </Tabs>

  );

}