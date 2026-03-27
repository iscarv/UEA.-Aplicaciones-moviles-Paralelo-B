// ======================================================
// IMPORTS
// ======================================================

// AsyncStorage para manejar el token JWT
import AsyncStorage from "@react-native-async-storage/async-storage";

// Detectar plataforma (web / móvil)
import { Platform } from "react-native";

// Instancia Axios configurada (baseURL)
import api from "./api";


// ======================================================
// BOOK SERVICE
// ======================================================
// CRUD de libros centralizado


// ======================================================
// CREAR LIBRO
// ======================================================
export const createBook = async (formData) => {

  const token = await AsyncStorage.getItem("token");

  console.log("📤 Enviando libro al backend...");

  try {

    const response = await fetch(`${api.defaults.baseURL}/books`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("📡 STATUS:", response.status);

    const text = await response.text();

    console.log("📥 RESPUESTA RAW:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.log("⚠️ Error parseando JSON:", e.message);
      data = null;
    }

    return data || { success: false };

  } catch (error) {

    console.log("❌ ERROR FETCH:", error.message);

    return { success: false };

  }
};


// ======================================================
// OBTENER LIBROS
// ======================================================
export const getBooks = async () => {

  try {

    const token = await AsyncStorage.getItem("token");

    console.log("🔑 TOKEN:", token);
    console.log("📚 Solicitando libros al backend...");

    const response = await fetch(`${api.defaults.baseURL}/books`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();

    console.log("📥 Libros RAW:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = [];
    }

    return Array.isArray(data) ? data : [];

  } catch (error) {

    console.log("❌ Error GET books:", error.message);

    return [];

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
// EDITAR LIBRO (FIX CON FETCH)
// ======================================================
export const updateBook = async (id, formData) => {

  const token = await AsyncStorage.getItem("token");

  console.log("✏️ Actualizando libro:", id);

  try {

    const response = await fetch(`${api.defaults.baseURL}/books/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("📡 STATUS UPDATE:", response.status);

    const text = await response.text();

    console.log("📥 RESPUESTA RAW UPDATE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }

    return data || { success: false };

  } catch (error) {

    console.log("❌ ERROR UPDATE FETCH:", error.message);

    return { success: false };

  }
};


// ======================================================
// NORMALIZAR IMAGEN (iOS FIX)
// ======================================================
export const normalizeImageUri = (image) => {

  return Platform.OS === "ios"
    ? image.replace("file://", "")
    : image;

};