// Persistencia local para marcar onboarding como visto
import AsyncStorage from "@react-native-async-storage/async-storage";

// Navegación Expo Router
import { useRouter } from "expo-router";

// Componentes React Native
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/*
  Pantalla inicial del onboarding
  Presenta la app y permite avanzar o saltar directo al login
*/

export default function Welcome() {
  const router = useRouter();

  /*
    Omitir onboarding:
    - Guarda bandera
    - Va directo al login
  */
  const skipOnboarding = async () => {
    await AsyncStorage.setItem("seenOnboarding", "true");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* Título principal */}
      <Text style={styles.title}>BookNotes 📚</Text>

      {/* Texto descriptivo */}
      <Text style={styles.text}>
        Bienvenido a BookNotes, tu espacio personal para registrar libros y
        organizar tu progreso de lectura.
      </Text>

      {/* Contenedor botones */}
      <View style={styles.buttons}>
        {/* BOTÓN SIGUIENTE */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/onboarding/features")}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>

        {/* BOTÓN SALTAR */}
        <TouchableOpacity style={styles.buttonOutline} onPress={skipOnboarding}>
          <Text style={styles.buttonOutlineText}>Saltar</Text>
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
    marginBottom: 20,
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

  // Botón principal rosado
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

  // Botón secundario con borde
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


