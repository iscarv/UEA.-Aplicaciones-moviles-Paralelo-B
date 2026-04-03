import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { useCamera } from "../../hooks/useCamera";
import { createBook } from "../../services/bookService";
import { saveImage } from "../../services/fileService";

export default function AddBookScreen() {
  const router = useRouter();
  const { takePhoto } = useCamera();

  // ================= STATES =================
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pagesTotal, setPagesTotal] = useState("");
  const [pagesRead, setPagesRead] = useState("");
  const [status, setStatus] = useState("Por leer");
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
        const saved = await saveImage(uri);
        setImage(saved);
      } else {
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
    formData.append("title", title);
    formData.append("author", author);
    formData.append("pages_total", pagesTotal || "0");
    formData.append("pages_read", pagesRead || "0");
    formData.append("status", status);

    // ================= SUBIR IMAGEN =================
    if (image) {
      let filename = image.split("/").pop() || "photo.jpg";
      if (!filename.includes(".")) filename = filename + ".jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      if (Platform.OS === "web") {
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append("image", blob, filename);
      } else {
        let uriForFormData = image;
        if (Platform.OS === "ios") uriForFormData = image.replace("file://", "");
        formData.append("image", { uri: uriForFormData, name: filename, type } as any);
      }
    }

    try {
      const result = await createBook(formData);
      console.log("Libro guardado:", result);
      Alert.alert("Éxito", "Libro guardado correctamente 📚");

      // limpiar formulario
      setTitle("");
      setAuthor("");
      setPagesTotal("");
      setPagesRead("");
      setStatus("Por leer");
      setImage(null);
    } catch (error) {
      console.error("Error guardando libro:", error);
      Alert.alert("Error", "No se pudo guardar el libro");
    } finally {
      setSaving(false);
    }
  };

  // ================= UI =================
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
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

      <TextInput
        style={styles.input}
        placeholder="Páginas totales"
        value={pagesTotal}
        onChangeText={setPagesTotal}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Páginas leídas"
        value={pagesRead}
        onChangeText={setPagesRead}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Estado</Text>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
        style={{ marginBottom: 15 }}
      >
        {["Por leer", "Leyendo", "Leído"].map((s) => (
          <Picker.Item key={s} label={s} value={s} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
        <Text style={styles.buttonText}>Tomar foto de portada</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={pickFromGallery}>
        <Text style={styles.buttonText}>Elegir desde galería</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#e75480", marginTop: 20 }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={[styles.buttonText, { color: "#fff" }]}>
          {saving ? "Guardando..." : "Guardar libro"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ================= STYLES =================
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
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  image: {
    width: 180,
    height: 260,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#e75480",
  },
});