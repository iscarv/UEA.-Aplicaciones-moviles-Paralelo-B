// Hook reutilizable para manejar la cámara
// Encapsula permisos y captura de fotos

import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { requestCameraPermission } from "../services/cameraService";

export const useCamera = () => {

  const [image, setImage] = useState(null);

  /**
   * Abre la cámara del dispositivo
   */
  const takePhoto = async () => {

    const permission = await requestCameraPermission();

    if (permission !== "granted") {
      alert("Permiso de cámara denegado");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      return uri;
    }
  };

  return {
    image,
    takePhoto,
  };
};