// ================= IMPORTS =================

// Permite redirigir automáticamente
import { Redirect } from "expo-router";

// AsyncStorage permite guardar datos en el dispositivo
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hooks de React
import { useEffect, useState } from "react";


/*
  ================= CONFIGURACIÓN =================

  Cambiar esta variable permite probar fácilmente el onboarding.

  false → comportamiento normal de la app
  true  → siempre mostrar onboarding (modo prueba)
*/

const FORCE_ONBOARDING = false;



/*
  ================= PANTALLA RAÍZ =================

  Decide automáticamente a dónde enviar al usuario:

   - Si NO ha visto onboarding → /onboarding/welcome
   - Si YA lo vio → /login
*/

export default function Index() {

  // Indica cuándo AsyncStorage terminó de cargar
  const [ready, setReady] = useState(false);

  // Guarda si el usuario ya vio el onboarding
  const [seenOnboarding, setSeenOnboarding] = useState(false);



  // ================= CARGAR ESTADO =================
  useEffect(() => {

    const check = async () => {

      // Lee la bandera guardada en el dispositivo
      const seen = await AsyncStorage.getItem("seenOnboarding");

      // Convierte a booleano
      setSeenOnboarding(!!seen);

      // Marca que ya terminó de cargar
      setReady(true);

    };

    check();

  }, []);



  // ================= MODO PRUEBA =================
  if (FORCE_ONBOARDING) {
    return <Redirect href="/onboarding/welcome" />;
  }



  // ================= ESPERAR CARGA =================
  if (!ready) return null;



  // ================= DECISIÓN DE NAVEGACIÓN =================

  // Si ya vio onboarding → login
  if (seenOnboarding) {
    return <Redirect href="/login" />;
  }

  // Si no lo ha visto → onboarding
  return <Redirect href="/onboarding/welcome" />;

}