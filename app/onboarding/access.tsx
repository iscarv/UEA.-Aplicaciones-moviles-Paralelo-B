// ================= IMPORTS =================

// Navegación con Expo Router
import { useRouter } from "expo-router";

// Persistencia local para guardar estado de onboarding
import AsyncStorage from "@react-native-async-storage/async-storage";

// Componentes de React Native
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/*
  Pantalla final del onboarding (Access)

  Aquí el usuario puede:
  - Crear una cuenta
  - Iniciar sesión

  En ambos casos:
  ✔ Se marca el onboarding como visto
  ✔ Se redirige a la pantalla correspondiente
*/

export default function Access() {
  const router = useRouter();

  /*
    Guarda en AsyncStorage que el onboarding ya fue visto
    Esto evita que vuelva a aparecer al reiniciar la app
  */
  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem("seenOnboarding", "true");
    } catch (error) {
      console.error("Error guardando seenOnboarding:", error);
    }
  };

  /*
    Termina onboarding y navega a LOGIN
  */
  const goToLogin = async () => {
    await finishOnboarding();

    // replace evita volver atrás al onboarding
    router.replace("/login");
  };

  /*
    Termina onboarding y navega a REGISTRO
  */
  const goToRegister = async () => {
    await finishOnboarding();

    router.replace("/register");
  };

  return (
    <View style={styles.container}>
      {/* ================= TÍTULO ================= */}
      <Text style={styles.title}>Comienza ahora</Text>

      {/* ================= DESCRIPCIÓN ================= */}
      <Text style={styles.text}>
        Crea tu cuenta o inicia sesión para empezar a registrar tus lecturas.
      </Text>

      {/* ================= BOTONES ================= */}
      <View style={styles.buttons}>

        {/* BOTÓN CREAR CUENTA */}
        <TouchableOpacity
          style={styles.button}
          onPress={goToRegister}
          accessibilityLabel="Crear una nueva cuenta"
        >
          <Text style={styles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>

        {/* BOTÓN INICIAR SESIÓN */}
        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={goToLogin}
          accessibilityLabel="Ir a iniciar sesión"
        >
          <Text style={styles.buttonOutlineText}>Iniciar sesión</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

/* ================= ESTILOS ================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#fde2ea",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e75480",
    textAlign: "center",
    marginBottom: 15,
  },

  text: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 16,
  },

  buttons: {
    marginTop: 20,
    gap: 15,
  },

  // Botón principal
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

  // Botón secundario
  buttonOutline: {
    borderWidth: 2,
    borderColor: "#e75480",
    paddingVertical: 12,
    borderRadius: 8,
  },

  buttonOutlineText: {
    color: "#e75480",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

});







