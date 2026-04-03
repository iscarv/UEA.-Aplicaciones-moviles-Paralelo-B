// ================= IMPORTS =================
import { Picker } from "@react-native-picker/picker"; // <-- CORRECTO
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { updateBook } from "../services/bookService";

// ================= SCREEN =================
export default function EditBookScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const getParam = (p: string | string[] | undefined): string =>
    Array.isArray(p) ? p[0] : p ?? "";

  const id = getParam(params.id);
  if (!id) {
    Alert.alert("Error", "ID del libro no válido");
    router.back();
    return null;
  }

  // ================= STATES =================
  const [title, setTitle] = useState(getParam(params.title));
  const [author, setAuthor] = useState(getParam(params.author));
  const [pagesTotal, setPagesTotal] = useState(getParam(params.pages_total));
  const [pagesRead, setPagesRead] = useState(getParam(params.pages_read));
  const [status, setStatus] = useState(getParam(params.status) || "Por leer");
  const [rating, setRating] = useState(Number(getParam(params.rating) || 0));

  // Estados para nuevas columnas
  const [personalNotes, setPersonalNotes] = useState(""); // notas personales
  const [chapterNotes, setChapterNotes] = useState<{ [key: string]: string }>({});

  const [chapter, setChapter] = useState("1");
  const [image, setImage] = useState<string | null>(getParam(params.image) || null);
  const [saving, setSaving] = useState(false);

  // ================= CARGAR NOTAS EXISTENTES =================
  useEffect(() => {
    if (params.notes) {
      try {
        const parsed = JSON.parse(getParam(params.notes));
        setPersonalNotes(parsed.personal || "");
        setChapterNotes(parsed.chapters || {});
      } catch (e) {
        console.log("No se pudo parsear notes:", e);
        setPersonalNotes(getParam(params.notes));
      }
    }
  }, [params.notes]);

  const total = Number(pagesTotal);
  const read = Number(pagesRead);
  const percent = total > 0 ? Math.round((read / total) * 100) : 0;

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
      formData.append("pages_total", pagesTotal || "0");
      formData.append("pages_read", pagesRead || "0");
      formData.append("status", status);
      formData.append("rating", rating.toString());

      // Guardar notas en las nuevas columnas
      formData.append("personal_notes", personalNotes);
      formData.append("chapter_notes", JSON.stringify(chapterNotes));

      // Imagen
      if (image && !image.includes("/uploads/")) {
        const filename = image.split("/").pop() || "photo.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        if (Platform.OS === "web") {
          const response = await fetch(image);
          const blob = await response.blob();
          formData.append("image", blob, filename);
        } else {
          formData.append("image", {
            uri: image,
            name: filename,
            type
          } as any);
        }
      }

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={true}
    >
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

      <TextInput
        style={styles.input}
        value={pagesTotal}
        onChangeText={setPagesTotal}
        placeholder="Páginas totales"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={pagesRead}
        onChangeText={setPagesRead}
        placeholder="Páginas leídas"
        keyboardType="numeric"
      />

      <Text style={styles.percent}>Progreso: {percent}%</Text>

      <Text style={styles.sectionTitle}>Estado</Text>
      <View style={styles.statusContainer}>
        {["Por leer", "Leyendo", "Leído"].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.statusBtn, status === s && styles.statusActive]}
            onPress={() => setStatus(s)}
          >
            <Text>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Calificación</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={styles.star}>{rating >= star ? "⭐" : "☆"}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Notas personales</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={personalNotes}
        onChangeText={setPersonalNotes}
        placeholder="Escribe tus notas personales..."
        multiline
      />

      <Text style={styles.sectionTitle}>Notas por capítulo</Text>
      <Text style={{ marginBottom: 6 }}>Selecciona capítulo</Text>

      <Picker
        selectedValue={chapter}
        style={{ height: 50, width: 150, marginBottom: 10 }}
        onValueChange={(itemValue: string) => setChapter(itemValue)}
      >
        {Array.from({ length: 200 }, (_, i) => i + 1).map((c) => (
          <Picker.Item key={c} label={`Capítulo ${c}`} value={`${c}`} />
        ))}
      </Picker>

      <TextInput
        style={[styles.input, { height: 80 }]}
        value={chapterNotes[chapter] || ""}
        onChangeText={(text) =>
          setChapterNotes({ ...chapterNotes, [chapter]: text })
        }
        placeholder={`Escribe nota del capítulo ${chapter}...`}
        multiline
      />

      {image && <Image source={{ uri: image }} style={styles.image} />}
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
    </ScrollView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fde2ea" },
  title: { fontSize: 24, fontWeight: "bold", color: "#e75480", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  percent: { fontWeight: "bold", marginBottom: 10 },
  sectionTitle: { fontWeight: "bold", marginBottom: 6 },
  statusContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  statusBtn: { backgroundColor: "#fff", padding: 10, borderRadius: 10 },
  statusActive: { backgroundColor: "#efa0b4" },
  starsContainer: { flexDirection: "row", marginBottom: 15 },
  star: { fontSize: 26, marginRight: 6 },
  image: { width: 180, height: 260, alignSelf: "center", marginTop: 20, borderRadius: 12 },
  button: { backgroundColor: "#fff", padding: 14, borderRadius: 14, alignItems: "center", marginTop: 10 },
  saveButton: { backgroundColor: "#e75480" },
  buttonText: { fontWeight: "bold", color: "#e75480" },
});