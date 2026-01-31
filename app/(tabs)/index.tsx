// Importa Redirect para navegación automática
import { Redirect } from "expo-router";

// AsyncStorage permite guardar datos localmente en el dispositivo
// Aquí lo usamos para saber si el usuario ya vio el onboarding
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hooks de React
import { useEffect, useState } from "react";

/*
  Pantalla raíz de la aplicación.

  Su función es decidir automáticamente a dónde enviar al usuario:

   Si NO ha visto el onboarding → /onboarding/welcome
   Si YA lo vio → /login

  Esto evita que el onboarding se repita cada vez que abre la app.
*/

export default function Index() {
  // Indica cuándo ya se leyó AsyncStorage
  const [ready, setReady] = useState(false);

  // Guarda si el onboarding ya fue visto
  const [seenOnboarding, setSeenOnboarding] = useState(false);

  // Se ejecuta al cargar la app
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

  // Mientras AsyncStorage carga, no se muestra nada
  // Evita errores de navegación temprana
  if (!ready) return null;

  // Si el usuario ya vio el onboarding → login
  if (seenOnboarding) {
    return <Redirect href="/login" />;
  }

  // Si no lo ha visto → onboarding
  return <Redirect href="/onboarding/welcome" />;
}
