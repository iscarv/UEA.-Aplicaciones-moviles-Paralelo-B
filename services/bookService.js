// ======================================================
// IMPORTS
// ======================================================

// Permite guardar y leer el token JWT en el dispositivo
import AsyncStorage from "@react-native-async-storage/async-storage";

// Permite detectar si la app corre en web o en móvil
import { Platform } from "react-native";

// Instancia personalizada de Axios configurada en api.ts
import api from "./api";


/*
====================================================
BOOK SERVICE
====================================================

Este archivo centraliza todas las operaciones
relacionadas con los libros:

✔ Crear libro (con imagen)
✔ Obtener libros del usuario
✔ Eliminar libro
✔ Editar libro

Todas las peticiones incluyen el token JWT
para autenticar al usuario en el backend.
*/


// ======================================================
// CREAR LIBRO
// ======================================================
export const createBook = async (formData) => {

  try {

    // Obtener token almacenado
    const token = await AsyncStorage.getItem("token");

    console.log("📤 Enviando libro al backend...");

    /*
    IMPORTANTE

    Cuando enviamos imágenes usamos FormData,
    por lo que el Content-Type debe ser:

    multipart/form-data

    Esto permite que Multer en el backend
    reciba correctamente el archivo en req.file
    */

    const response = await api.post("/books", formData, {

      headers: {
        Authorization: `Bearer ${token}`,

        // ⚠ Necesario para React Native + imágenes
        "Content-Type": "multipart/form-data",
      },

    });

    console.log("📥 Respuesta backend:", response.data);

    return response.data;

  } catch (error) {

    console.log(
      "❌ Error creando libro:",
      error.response?.data || error.message
    );

    throw error;
  }

};


// ======================================================
// OBTENER LIBROS
// ======================================================
export const getBooks = async () => {

  try {

    // Obtener token guardado
    const token = await AsyncStorage.getItem("token");

    console.log("📚 Solicitando libros al backend...");

    const res = await api.get("/books", {

      headers: {
        Authorization: `Bearer ${token}`,
      },

    });

    console.log("📥 Libros recibidos:", res.data);

    return res.data;

  } catch (error) {

    console.error("❌ Error obteniendo libros:", error);

    throw error;

  }

};


// ======================================================
// ELIMINAR LIBRO
// ======================================================
export const deleteBook = async (id) => {

  try {

    const token = await AsyncStorage.getItem("token");

    console.log("🗑 Eliminando libro:", id);

    await api.delete(`/books/${id}`, {

      headers: {
        Authorization: `Bearer ${token}`,
      },

    });

  } catch (error) {

    console.error("❌ Error eliminando libro:", error);

    throw error;

  }

};


// ======================================================
// EDITAR LIBRO
// ======================================================
export const updateBook = async (id, data) => {

  try {

    const token = await AsyncStorage.getItem("token");

    console.log("✏️ Actualizando libro:", id);

    /*
    Igual que al crear libro,
    si enviamos imagen debemos usar multipart/form-data
    */

    const res = await api.put(`/books/${id}`, data, {

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },

    });

    return res.data;

  } catch (error) {

    console.error("❌ Error actualizando libro:", error);

    throw error;

  }

};


// ======================================================
// FUNCIÓN AUXILIAR PARA NORMALIZAR URI DE IMAGEN
// ======================================================

/*
En iOS las rutas de archivo incluyen "file://"
y algunas librerías no lo aceptan.

Esta función elimina ese prefijo cuando es necesario.
*/

export const normalizeImageUri = (image) => {

  return Platform.OS === "ios"
    ? image.replace("file://", "")
    : image;

};