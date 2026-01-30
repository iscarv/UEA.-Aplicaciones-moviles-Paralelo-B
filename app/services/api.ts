// Importa axios para realizar peticiones HTTP al backend
import axios from "axios";
// Permite detectar si la app se ejecuta en web o en móvil
import { Platform } from "react-native";

// Define la URL base del backend según la plataforma
const baseURL =
  Platform.OS === "web"
    ? "http://localhost:3000/api"                  // Cuando se ejecuta en navegador (Expo Web)
    : "http://192.168.100.12:3000/api";           // Cuando se ejecuta en celular (Expo Go)

// Crea una instancia de axios
const api = axios.create({
  baseURL,
});

export default api;

