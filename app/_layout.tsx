// ================= IMPORTS =================

// Stack permite navegación tipo pila (pantallas una sobre otra)
import { Stack } from "expo-router";

/*
========================================================
LAYOUT PRINCIPAL DE LA APLICACIÓN
========================================================

Este archivo define la navegación principal de la app.

Aquí se registran únicamente las pantallas globales
que no pertenecen al sistema de pestañas.

Incluye:

✔ Pantalla inicial
✔ Onboarding
✔ Autenticación
✔ Sistema de pestañas

Las pantallas dentro de (tabs) se controlan desde
app/(tabs)/_layout.tsx
*/

export default function Layout() {

  return (

    <Stack>

      {/* =================================================
         PANTALLA RAÍZ
         =================================================

         index.tsx decide automáticamente a dónde enviar
         al usuario dependiendo del estado:

         - Primera vez → onboarding
         - No autenticado → login
         - Autenticado → tabs
      */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />



      {/* =================================================
         ONBOARDING
         =================================================

         Flujo de introducción que aparece
         solo la primera vez que se abre la app.
      */}

      {/* Pantalla de bienvenida */}
      <Stack.Screen
        name="onboarding/welcome"
        options={{ headerShown: false }}
      />

      {/* Pantalla de características */}
      <Stack.Screen
        name="onboarding/features"
        options={{ headerShown: false }}
      />

      {/* Pantalla final del onboarding */}
      <Stack.Screen
        name="onboarding/access"
        options={{ headerShown: false }}
      />



      {/* =================================================
         AUTENTICACIÓN
         ================================================= */}

      {/* Pantalla de login */}
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />

      {/* Pantalla de registro */}
      <Stack.Screen
        name="register"
        options={{
          title: "Registro",
          headerBackTitle: "Volver"
        }}
      />



      {/* =================================================
         SISTEMA DE PESTAÑAS
         =================================================

         Aquí se carga el layout de pestañas
         definido en:

         app/(tabs)/_layout.tsx

         Ese layout controla las pantallas:

         ✔ home
         ✔ add-book
         ✔ my-books
      */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

    </Stack>

  );

}