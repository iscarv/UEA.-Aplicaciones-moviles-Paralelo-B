// ================= IMPORTS =================

// Axios para realizar peticiones HTTP
import axios from "axios";

// Permite detectar si la app corre en web o móvil
import { Platform } from "react-native";

// AsyncStorage para obtener el token guardado
import AsyncStorage from "@react-native-async-storage/async-storage";


// ================= BASE URL =================

/*
  Definimos la URL del backend dependiendo de la plataforma.

  - Web → localhost
  - Móvil → IP local del backend
*/

const baseURL =
  Platform.OS === "web"
    ? "http://localhost:3000/api"
    : "http://192.168.100.10:3000/api";


// ================= INSTANCIA AXIOS =================

/*
  Creamos una instancia personalizada de axios
  que usaremos en toda la aplicación.
*/

const api = axios.create({
  baseURL,

  // Tiempo máximo de espera de una petición
  timeout: 10000,

  // Headers por defecto
  headers: {
    "Content-Type": "application/json",
  },
});


// ================= INTERCEPTOR REQUEST =================

/*
  Este interceptor se ejecuta antes de cada petición.

  Su función es:
  - Obtener el token guardado en AsyncStorage
  - Agregarlo al header Authorization
*/

api.interceptors.request.use(
  async (config) => {

    try {

      const token = await AsyncStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

    } catch (err) {
      console.error("Error obteniendo token:", err);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ================= INTERCEPTOR RESPONSE =================

/*
  Este interceptor maneja respuestas del servidor.

  Ejemplo:
  Si el backend responde 401 (token inválido o expirado),
  podemos limpiar sesión automáticamente.
*/

api.interceptors.response.use(
  (response) => response,

  async (error) => {

    if (error.response?.status === 401) {

      console.warn("Token inválido o expirado");

      // Limpiar sesión
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("token_expires");

      // Aquí normalmente redirigiríamos a login
      // pero eso se controla desde index.tsx
    }

    return Promise.reject(error);
  }
);


// ================= EXPORT =================

// Exportamos la instancia para usarla en toda la app
export default api;
