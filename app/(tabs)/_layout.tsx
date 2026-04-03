// ================= IMPORTS =================

// Tabs permite crear navegación inferior por pestañas
// en la parte inferior de la aplicación
import { Tabs } from "expo-router";

// Librería de iconos incluida en Expo
import { Ionicons } from "@expo/vector-icons";


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
*/


export default function TabLayout() {

  return (

    <Tabs

      // ================= CONFIGURACIÓN GENERAL =================
      screenOptions={{

        // Color del icono cuando la pestaña está activa
        tabBarActiveTintColor: "#e75480",

        // Color del icono cuando la pestaña está inactiva
        tabBarInactiveTintColor: "gray",

        // Mostrar encabezado arriba de cada pantalla
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
         PESTAÑA HISTORIAL DE LECTURAS RECIENTES
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

    </Tabs>

  );

}