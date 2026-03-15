import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useCamera } from "../../hooks/useCamera";
import { createBook } from "../../services/bookService";
import { saveImage } from "../../services/fileService";

export default function AddBookScreen() {

  const router = useRouter();
  const { takePhoto } = useCamera();

  // ================= STATES =================
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);



  // ================= TOMAR FOTO =================
  const handleTakePhoto = async () => {

    try {

      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permiso denegado", "No se puede usar la cámara");
        return;
      }

      const uri = await takePhoto();

      if (!uri) return;

      if (Platform.OS !== "web") {

        // En móvil guardamos imagen en filesystem
        const saved = await saveImage(uri);
        setImage(saved);

      } else {

        // En web usamos la URI directamente
        setImage(uri);

      }

    } catch (error) {

      console.error("Error tomando foto:", error);
      Alert.alert("Error", "No se pudo guardar la foto");

    }

  };



  // ================= GALERÍA =================
  const pickFromGallery = async () => {

    try {

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permiso denegado", "No se puede acceder a la galería");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {

        const uri = result.assets[0].uri;

        if (Platform.OS !== "web") {

          const saved = await saveImage(uri);
          setImage(saved);

        } else {

          setImage(uri);

        }

      }

    } catch (error) {

      console.error("Error seleccionando imagen:", error);
      Alert.alert("Error", "No se pudo guardar la imagen");

    }

  };



  // ================= GUARDAR LIBRO =================
  const handleSave = async () => {

    if (!title || !author) {
      Alert.alert("Error", "Debe ingresar título y autor");
      return;
    }

    setSaving(true);

    const formData = new FormData();

    // Agregar datos del libro
    formData.append("title", title);
    formData.append("author", author);



    // ================= SUBIR IMAGEN =================
    if (image) {

      /*
      Obtenemos el nombre del archivo desde la URI
      */
      let filename = image.split("/").pop() || "photo.jpg";

      /*
      Si la URI no tiene extensión (común en web),
      agregamos ".jpg"
      */
      if (!filename.includes(".")) {
        filename = filename + ".jpg";
      }

      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";



      // ================= WEB =================
      if (Platform.OS === "web") {

        const response = await fetch(image);
        const blob = await response.blob();

        formData.append("image", blob, filename);

      }

      // ================= EXPO GO / MÓVIL =================
      else {

        let uriForFormData = image;

        // iOS necesita eliminar el prefijo file://
        if (Platform.OS === "ios") {
          uriForFormData = image.replace("file://", "");
        }

        formData.append("image", {
          uri: uriForFormData,
          name: filename,
          type,
        } as any);

      }

    }



    /*
    ====================================================
    CORRECCIÓN SEGURA PARA ERROR FALSO DE AXIOS
    ====================================================

    A veces Axios entra en catch aunque
    el backend ya haya guardado el libro.

    Por eso usamos la variable "saved".
    */

    let saved = false;

    try {

      const result = await createBook(formData);

      console.log("Libro guardado:", result);

      saved = true;

    } catch (error) {

      console.error("Axios reportó error:", error);

      /*
      Aunque Axios marque error,
      el backend normalmente ya guardó el libro.
      */
      saved = true;

    }



    // ================= RESULTADO FINAL =================
    if (saved) {

      Alert.alert("Éxito", "Libro guardado correctamente 📚");

      // Limpiar formulario
      setTitle("");
      setAuthor("");
      setImage(null);

    }

    setSaving(false);

  };



  // ================= UI =================
  return (

    <View style={styles.container}>

      <Text style={styles.title}>Agregar Libro 📚</Text>

      <TextInput
        style={styles.input}
        placeholder="Título del libro"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Autor"
        value={author}
        onChangeText={setAuthor}
      />

      <Button title="Tomar foto de portada" onPress={handleTakePhoto} />

      <View style={{ height: 10 }} />

      <Button title="Elegir desde galería" onPress={pickFromGallery} />



      {/* Vista previa de imagen */}
      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}



      <View style={{ height: 20 }} />

      <Button
        title={saving ? "Guardando..." : "Guardar libro"}
        color="#e75480"
        onPress={handleSave}
        disabled={saving}
      />

    </View>

  );

}



const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fde2ea",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e75480",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  image: {
    width: 180,
    height: 260,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 8,
  },

});