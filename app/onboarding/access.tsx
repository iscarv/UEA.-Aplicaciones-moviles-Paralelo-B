// Navegación con Expo Router
import { useRouter } from "expo-router";

// Persistencia local para guardar que el onboarding ya fue visto
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

  Aquí el usuario decide:
  - Crear cuenta
  - Iniciar sesión

  En ambos casos:
  ✔ Se marca onboarding como visto
  ✔ Se navega a la pantalla correspondiente
*/

export default function Access() {
  const router = useRouter();

  /*
    Termina onboarding y va a LOGIN
  */
  const goToLogin = async () => {
    // Marca onboarding como completado
    await AsyncStorage.setItem("seenOnboarding", "true");

    // Navega al login
    router.replace("/login");
  };

  /*
    Termina onboarding y va a REGISTRO
  */
  const goToRegister = async () => {
    // Marca onboarding como completado
    await AsyncStorage.setItem("seenOnboarding", "true");

    // Navega al registro
    router.replace("/register");
  };

  return (
    <View style={styles.container}>
      {/* Título principal */}
      <Text style={styles.title}>Comienza ahora</Text>

      {/* Texto descriptivo */}
      <Text style={styles.text}>
        Crea tu cuenta o inicia sesión para empezar a registrar tus lecturas.
      </Text>

      {/* Contenedor de botones */}
      <View style={styles.buttons}>
        {/* BOTÓN CREAR CUENTA */}
        <TouchableOpacity style={styles.button} onPress={goToRegister}>
          <Text style={styles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>

        {/* BOTÓN INICIAR SESIÓN */}
        <TouchableOpacity style={styles.buttonOutline} onPress={goToLogin}>
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

  // Botón rosado principal
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

  // Botón con borde
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







