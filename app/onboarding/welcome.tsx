// ================= IMPORTS =================

// Permite guardar datos persistentes en el dispositivo
import AsyncStorage from "@react-native-async-storage/async-storage";

// Router para navegar entre pantallas
import { useRouter } from "expo-router";

// Hook de React para ejecutar código al cargar el componente
import { useEffect } from "react";

// Componentes de interfaz de React Native
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


/*
  ================= PANTALLA WELCOME =================

  Esta es la primera pantalla del onboarding.

  Flujo completo del onboarding:

  Welcome
     ↓
  Features
     ↓
  Access
     ↓
  Login / Register

  El onboarding solo debería mostrarse la primera vez
  gracias a la variable guardada en AsyncStorage:

      seenOnboarding
*/

export default function Welcome() {

  // Hook de navegación de Expo Router
  const router = useRouter();



  /*
    ================= EFECTO AL CARGAR =================

    Este useEffect se ejecuta una vez cuando
    la pantalla se carga.

    Aquí solo lo usamos para imprimir en consola
    que la pantalla se abrió correctamente.
  */
  useEffect(() => {
    console.log("Pantalla Welcome cargada");
  }, []);



  /*
    ================= SALTAR ONBOARDING =================

    Este botón permite al usuario saltar el onboarding.

    Lo que hace:
    1. Guarda en AsyncStorage que el onboarding ya fue visto
    2. Redirige directamente al login
  */
  const skipOnboarding = async () => {

    try {

      // Guardamos bandera indicando que ya vio el onboarding
      await AsyncStorage.setItem("seenOnboarding", "true");

      // Redirige al login y elimina esta pantalla del historial
      router.replace("/login");

    } catch (error) {

      console.error("Error guardando estado del onboarding:", error);

    }
  };



  /*
    ================= SIGUIENTE PANTALLA =================

    Este botón lleva al usuario a la siguiente pantalla
    del onboarding: Features.

    Usamos router.push para que el botón "Atrás"
    del teléfono pueda regresar a Welcome.
  */
  const goToFeatures = () => {

    router.push("/onboarding/features");

  };



  // ================= INTERFAZ =================
  return (

    <View style={styles.container}>

      {/* ================= TÍTULO DE LA APP ================= */}
      <Text style={styles.title}>
        BookNotes 📚
      </Text>


      {/* ================= TEXTO DE BIENVENIDA ================= */}
      <Text style={styles.text}>
        Bienvenido a BookNotes, tu espacio personal para registrar libros
        y organizar tu progreso de lectura.
      </Text>



      {/* ================= BOTONES ================= */}
      <View style={styles.buttons}>

        {/* BOTÓN PARA IR A LA SIGUIENTE PANTALLA DEL ONBOARDING */}
        <TouchableOpacity
          style={styles.button}
          onPress={goToFeatures}
        >
          <Text style={styles.buttonText}>
            Siguiente
          </Text>
        </TouchableOpacity>



        {/* BOTÓN PARA SALTAR EL ONBOARDING */}
        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={skipOnboarding}
        >
          <Text style={styles.buttonOutlineText}>
            Saltar
          </Text>
        </TouchableOpacity>

      </View>

    </View>

  );
}



// ================= ESTILOS =================
const styles = StyleSheet.create({

  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#fde2ea",
  },

  // Título principal de la aplicación
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e75480",
    textAlign: "center",
    marginBottom: 20,
  },

  // Texto descriptivo debajo del título
  text: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 24,
  },

  // Contenedor de los botones
  buttons: {
    marginTop: 20,
    gap: 15,
  },

  // Estilo del botón principal (Siguiente)
  button: {
    backgroundColor: "#e75480",
    paddingVertical: 12,
    borderRadius: 8,
  },

  // Texto del botón principal
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Estilo del botón secundario (Saltar)
  buttonOutline: {
    borderWidth: 2,
    borderColor: "#e75480",
    paddingVertical: 12,
    borderRadius: 8,
  },

  // Texto del botón secundario
  buttonOutlineText: {
    color: "#e75480",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

});