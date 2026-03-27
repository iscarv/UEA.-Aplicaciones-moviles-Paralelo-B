// ================= IMPORTS =================

// Axios para realizar peticiones HTTP
import axios from "axios";

// Permite detectar si la app corre en web o móvil
import { Platform } from "react-native";

// AsyncStorage para obtener el token guardado
import AsyncStorage from "@react-native-async-storage/async-storage";


// ================= BASE URL =================

/*
====================================================
CONFIGURACIÓN DE URL DEL BACKEND
====================================================

WEB:
✔ Usa localhost

MÓVIL (Expo Go):
✔ DEBE usar la IP de tu computadora
✔ NO usar localhost (no funciona en celular)

IMPORTANTE:
✔ Debe ser la misma IP que usas en el navegador
✔ Ejemplo: http://192.168.100.10:3000
*/

const baseURL =
  Platform.OS === "web"
    ? "http://localhost:3000/api"
    : "http://192.168.100.10:3000/api"; // 🔥 TU IP LOCAL


// ================= INSTANCIA AXIOS =================

/*
====================================================
CONFIGURACIÓN DE AXIOS
====================================================

✔ Se usa para GET, DELETE, PUT
✔ Para POST con imágenes usamos fetch (en bookService)

NO definir Content-Type manualmente aquí
*/

const api = axios.create({
  baseURL,

  timeout: 10000,

  headers: {
    Accept: "application/json",
  },
});


// ================= INTERCEPTOR REQUEST =================

/*
====================================================
AGREGAR TOKEN AUTOMÁTICAMENTE
====================================================

✔ Antes de cada petición:
  - Obtiene token
  - Lo agrega al header Authorization

Esto permite acceder a rutas protegidas
*/

api.interceptors.request.use(
  async (config) => {

    try {

      const token = await AsyncStorage.getItem("token");

      // 🔥 DEBUG CLAVE
      console.log("🔐 Interceptor token:", token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

    } catch (err) {

      console.error("Error obteniendo token:", err);

    }

    return config;

  },

  (error) => Promise.reject(error)
);


// ================= INTERCEPTOR RESPONSE =================

/*
====================================================
MANEJO DE ERRORES 401
====================================================

Si el token expira:

✔ Se elimina del storage
✔ Se fuerza re-login
*/

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    if (error.response?.status === 401) {

      console.warn("⚠️ Token inválido o expirado");

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("token_expires");

    }

    return Promise.reject(error);
  }

);


// ================= EXPORT =================

export default api;