// ================= IMPORT =================
// Usamos la API legacy para evitar errores en Expo SDK 54
import * as FileSystem from "expo-file-system/legacy";

/*
====================================================
SERVICIO DE ARCHIVOS
====================================================

Este servicio guarda imágenes en el almacenamiento
local del dispositivo antes de enviarlas al backend.
*/

// ================= GUARDAR IMAGEN =================
export const saveImage = async (uri) => {
  try {

    // carpeta donde se guardarán las imágenes
    const directory = FileSystem.documentDirectory + "covers/";

    // verificar si existe la carpeta
    const dirInfo = await FileSystem.getInfoAsync(directory);

    // si no existe la creamos
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }

    // crear nombre único
    const filename = Date.now() + ".jpg";

    const newPath = directory + filename;

    // copiar imagen al almacenamiento local
    await FileSystem.copyAsync({
      from: uri,
      to: newPath,
    });

    // devolver nueva ruta
    return newPath;

  } catch (error) {

    console.error("Error guardando imagen:", error);

    return null;

  }
};