// ================= IMPORTS =================
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { updateBook } from "../services/bookService";


// ================= SCREEN =================
export default function EditBookScreen() {

  const router = useRouter();
  const params = useLocalSearchParams();

  // ================= SAFE PARAM =================
  const getParam = (p: string | string[] | undefined): string =>
    Array.isArray(p) ? p[0] : p ?? "";

  const id = getParam(params.id);

  // 🔥 FIX: evitar AxiosError por ID vacío
  if (!id) {
    Alert.alert("Error", "ID del libro no válido");
    router.back();
    return null;
  }

  // ================= STATES =================
  const [title, setTitle] = useState(getParam(params.title));
  const [author, setAuthor] = useState(getParam(params.author));
  const [image, setImage] = useState<string | null>(
    getParam(params.image) || null
  );

  const [saving, setSaving] = useState(false);


  // ================= PICK IMAGE =================
  const pickImage = async () => {

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso denegado");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  // ================= SAVE BOOK =================
  const saveBook = async () => {

    if (!title || !author) {
      Alert.alert("Error", "Debe ingresar título y autor");
      return;
    }

    setSaving(true);

    try {

      const formData = new FormData();

      formData.append("title", title);
      formData.append("author", author);

      // ================= IMAGE HANDLING =================
      if (image && image.startsWith("file")) {

        const filename = image.split("/").pop() || "photo.jpg";

        const match = /\.(\w+)$/.exec(filename);

        const type = match
          ? `image/${match[1]}`
          : "image/jpeg";

        formData.append("image", {
          uri: image,
          name: filename,
          type
        } as any);
      }

      // 🔥 FIX: update con token (desde service)
      await updateBook(id, formData);

      Alert.alert("Éxito", "Libro actualizado correctamente");

      router.back();

    } catch (error) {

      console.log("❌ ERROR UPDATE:", error);

      Alert.alert("Error", "No se pudo actualizar el libro");

    } finally {
      setSaving(false);
    }
  };


  // ================= UI =================
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Editar Libro 📚</Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
      />

      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
        placeholder="Autor"
      />

      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      {/* ================= BUTTONS ================= */}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Cambiar imagen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={saveBook}
      >
        <Text style={[styles.buttonText, { color: "#fff" }]}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}


// ================= STYLES =================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fde2ea"
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e75480",
    marginBottom: 20,
    textAlign: "center"
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12, // 🔥 más redondeado
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd"
  },

  image: {
    width: 180,
    height: 260,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 12
  },

  // ================= BUTTON STYLE =================
  button: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10
  },

  saveButton: {
    backgroundColor: "#e75480"
  },

  buttonText: {
    fontWeight: "bold",
    color: "#e75480"
  }

});