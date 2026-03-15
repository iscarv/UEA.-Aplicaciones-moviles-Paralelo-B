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

WEB:
http://localhost:3000

MÓVIL (Expo Go):
usar la IP local del backend
*/

const baseURL =
  Platform.OS === "web"
    ? "http://localhost:3000/api"
    : "http://192.168.100.10:3000/api";


// ================= INSTANCIA AXIOS =================

/*
Creamos una instancia personalizada de axios
para usarla en toda la aplicación.

⚠ IMPORTANTE

NO definir "Content-Type": "application/json"

porque cuando enviamos imágenes usando FormData,
Axios necesita establecer automáticamente:

multipart/form-data

Si se fija manualmente application/json,
Multer en el backend NO recibe el archivo.
*/

const api = axios.create({
  baseURL,

  // Tiempo máximo de espera de la petición
  timeout: 10000,

  // Headers por defecto
  headers: {
    Accept: "application/json", // Solo indicamos que esperamos JSON
  },
});


// ================= INTERCEPTOR REQUEST =================

/*
Este interceptor se ejecuta antes de cada petición.

Su función es:

1️⃣ Obtener el token guardado en AsyncStorage
2️⃣ Agregarlo al header Authorization

Esto permite que todas las rutas protegidas
del backend reciban el token JWT.
*/

api.interceptors.request.use(
  async (config) => {

    try {

      // Obtener token almacenado
      const token = await AsyncStorage.getItem("token");

      // Si existe token lo agregamos al header
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

Ejemplo de uso:

Si el backend responde 401 significa:

✔ token expirado
✔ token inválido
✔ usuario no autenticado

En ese caso limpiamos la sesión automáticamente.
*/

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    if (error.response?.status === 401) {

      console.warn("Token inválido o expirado");

      // Eliminar token guardado
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("token_expires");

      // La redirección al login se controla
      // desde index.tsx en el frontend
    }

    return Promise.reject(error);
  }

);


// ================= EXPORT =================

// Exportamos la instancia de axios
// para usarla en todos los servicios de la app
export default api;