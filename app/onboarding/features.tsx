// Navegación Expo Router
import { useRouter } from "expo-router";

// Componentes React Native
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/*
  Pantalla intermedia del onboarding (funcionalidades)
*/

export default function Features() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Título principal */}
      <Text style={styles.title}>¿Qué puedes hacer?</Text>

      {/* Lista de funcionalidades */}
      <Text style={styles.text}>
        • Registrar tus libros{"\n"}
        • Marcar tu progreso{"\n"}
        • Guardar notas personales{"\n"}
        • Calificar con estrellas{"\n"}
        • Organizar tus lecturas
      </Text>

      {/* Contenedor botones */}
      <View style={styles.buttons}>
        {/* BOTÓN ATRÁS */}
        <TouchableOpacity style={styles.buttonOutline} onPress={() => router.back()}>
          <Text style={styles.buttonOutlineText}>Atrás</Text>
        </TouchableOpacity>

        {/* BOTÓN SIGUIENTE */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/onboarding/access")}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
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

  // Botón con borde (atrás)
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
