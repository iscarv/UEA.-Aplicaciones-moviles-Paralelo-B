// Servicio encargado de interactuar con la cámara del dispositivo
// Mantiene la lógica de hardware separada de la interfaz

import { Camera } from "expo-camera";

/**
 * Solicita permiso para usar la cámara
 */
export const requestCameraPermission = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  return status;
};