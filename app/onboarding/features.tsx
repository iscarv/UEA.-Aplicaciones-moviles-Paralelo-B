// ================= IMPORTS =================

// Hook de navegación de Expo Router
import { useRouter } from "expo-router";

// Componentes de interfaz de React Native
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/*
  Pantalla intermedia del onboarding (Features)

  Aquí mostramos al usuario qué puede hacer dentro de BookNotes.

  Flujo:
  Welcome -> Features -> Access -> Login/Register
*/

export default function Features() {

  // Inicializa el router para navegar entre pantallas
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* ================= TÍTULO ================= */}
      <Text style={styles.title}>¿Qué puedes hacer?</Text>

      {/* ================= LISTA DE FUNCIONALIDADES ================= */}
      <Text style={styles.text}>
        • Registrar tus libros{"\n"}
        • Marcar tu progreso{"\n"}
        • Guardar notas personales{"\n"}
        • Calificar con estrellas{"\n"}
        • Organizar tus lecturas
      </Text>

      {/* ================= CONTENEDOR BOTONES ================= */}
      <View style={styles.buttons}>

        {/* BOTÓN ATRÁS
           Regresa a la pantalla anterior del onboarding
        */}
        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonOutlineText}>Atrás</Text>
        </TouchableOpacity>

        {/* BOTÓN SIGUIENTE
           Avanza a la pantalla final del onboarding (Access)

           replace() se usa para evitar que el usuario vuelva
           a esta pantalla con el historial
        */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/onboarding/access")}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

/* ================= ESTILOS ================= */

const styles = StyleSheet.create({

  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#fde2ea",
  },

  // Título principal
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e75480",
    textAlign: "center",
    marginBottom: 15,
  },

  // Texto descriptivo
  text: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 24,
  },

  // Contenedor de botones
  buttons: {
    marginTop: 20,
    gap: 15,
  },

  // Botón principal (rosado)
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

  // Botón con borde (Atrás)
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
