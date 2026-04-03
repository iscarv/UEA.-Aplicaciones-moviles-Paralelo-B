// ======================================================
// IMPORTS
// ======================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

// ======================================================
// CREAR LIBRO
// ======================================================

export const createBook = async (formData) => {
  const token = await AsyncStorage.getItem("token");

  try {
    const response = await fetch(`${api.defaults.baseURL}/books`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    return await response.json();
  } catch (error) {
    console.log("❌ Error creando libro:", error);
    return { success: false };
  }
};

// ======================================================
// OBTENER LIBROS
// ======================================================

export const getBooks = async () => {
  const token = await AsyncStorage.getItem("token");

  try {
    const response = await fetch(`${api.defaults.baseURL}/books`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return await response.json();
  } catch (error) {
    console.log("❌ Error obteniendo libros:", error);
    return [];
  }
};

// ======================================================
// OBTENER ÚLTIMAS LECTURAS (CORREGIDO)
// ======================================================

export const getRecentBooks = async (limit = 5) => {
  const token = await AsyncStorage.getItem("token");

  try {
    // Llamamos al endpoint específico para lecturas recientes
    const response = await fetch(
      `${api.defaults.baseURL}/books/recent?limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.error("❌ Error cargando lecturas recientes:", error);
    return [];
  }
};

// ======================================================
// ELIMINAR LIBRO (FIX WEB)
// ======================================================

export const deleteBook = async (id) => {
  const token = await AsyncStorage.getItem("token");

  try {
    const response = await fetch(`${api.defaults.baseURL}/books/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Error eliminando libro");
    }

    return true;
  } catch (error) {
    console.log("❌ Error eliminando libro:", error);
    throw error;
  }
};

// ======================================================
// ACTUALIZAR LIBRO
// FUNCIONA CON JSON Y FORM-DATA
// ======================================================

export const updateBook = async (id, data) => {
  const token = await AsyncStorage.getItem("token");

  try {
    let options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: null
    };

    // ======================================================
    // FORM DATA (PORTADA) - FIX WEB
    // ======================================================
    if (data instanceof FormData) {
      options.headers = {
        Authorization: `Bearer ${token}`
      };
      options.body = data;
    }
    // ======================================================
    // JSON (FAVORITOS / TEXTO)
    // ======================================================
    else {
      options.headers = {
        ...options.headers,
        "Content-Type": "application/json"
      };
      // Forzar que se actualice updated_at automáticamente
      data.updated_at = new Date().toISOString();
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${api.defaults.baseURL}/books/${id}`, options);

    return await response.json();
  } catch (error) {
    console.log("❌ Error actualizando libro:", error);
    return { success: false };
  }
};