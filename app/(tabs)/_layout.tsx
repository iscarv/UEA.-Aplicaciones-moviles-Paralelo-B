// ================= IMPORTS =================

// Stack permite navegación tipo pila (similar a React Navigation)
import { Stack } from "expo-router";

/*
  ================= LAYOUT PRINCIPAL =================

  Este archivo define todas las pantallas disponibles
  dentro de la aplicación usando Expo Router.

  Aunque Expo Router puede detectar rutas automáticamente
  por la estructura de carpetas, declarar las pantallas
  aquí permite configurar:

  - Mostrar u ocultar el header
  - Títulos
  - Comportamiento del stack
*/

export default function Layout() {
  return (
    <Stack>

      {/* ================= PANTALLA RAÍZ =================
          index.tsx decide automáticamente a dónde redirigir:

          - onboarding
          - login
          - home
      */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />


      {/* ================= ONBOARDING =================
          Flujo de introducción que aparece solo
          la primera vez que el usuario abre la app
      */}

      {/* Pantalla de bienvenida */}
      <Stack.Screen
        name="onboarding/welcome"
        options={{ headerShown: false }}
      />

      {/* Pantalla que explica funcionalidades */}
      <Stack.Screen
        name="onboarding/features"
        options={{ headerShown: false }}
      />

      {/* Pantalla final del onboarding */}
      <Stack.Screen
        name="onboarding/access"
        options={{ headerShown: false }}
      />


      {/* ================= AUTENTICACIÓN ================= */}

      {/* Login */}
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />

      {/* Registro */}
      <Stack.Screen
        name="register"
        options={{
          title: "Registro",
          headerBackTitle: "Volver"
        }}
      />


      {/* ================= HOME =================
          Pantalla principal después de iniciar sesión
      */}
      <Stack.Screen
        name="home"
        options={{
          title: "BookNotes"
        }}
      />

    </Stack>
  );
}