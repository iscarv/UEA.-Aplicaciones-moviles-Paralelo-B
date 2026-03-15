// ================= IMPORTS =================
import React, { useState } from "react";
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { updateBook } from "../services/bookService";

export default function EditBookScreen() {

  const router = useRouter();
  const params = useLocalSearchParams();

  /*
  ====================================================
  FUNCIÓN PARA CONVERTIR PARÁMETROS A STRING
  ====================================================
  Expo Router devuelve:
  string | string[] | undefined

  Esta función lo convierte a string seguro
  */

  const getParam = (p: string | string[] | undefined): string =>
    Array.isArray(p) ? p[0] : p ?? "";

  /*
  ====================================================
  ESTADOS
  ====================================================
  */

  const id = getParam(params.id);

  const [title, setTitle] = useState<string>(getParam(params.title));
  const [author, setAuthor] = useState<string>(getParam(params.author));
  const [image, setImage] = useState<string | null>(getParam(params.image) || null);

  const [saving, setSaving] = useState(false);


  /*
  ====================================================
  ELEGIR IMAGEN
  ====================================================
  */
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


  /*
  ====================================================
  GUARDAR CAMBIOS
  ====================================================
  */
  const saveBook = async () => {

    if (!title || !author) {
      Alert.alert("Debe ingresar título y autor");
      return;
    }

    setSaving(true);

    try {

      const formData = new FormData();

      formData.append("title", title);
      formData.append("author", author);

      /*
      Si la imagen es nueva (viene del teléfono)
      */
      if (image && image.startsWith("file")) {

        const filename = image.split("/").pop() || "photo.jpg";

        const match = /\.(\w+)$/.exec(filename);

        const type = match
          ? `image/${match[1]}`
          : "image/jpeg";

        formData.append(
          "image",
          {
            uri: image,
            name: filename,
            type
          } as any
        );

      }

      await updateBook(id, formData);

      Alert.alert("Libro actualizado");

      router.back();

    } catch (error) {

      console.log(error);

      Alert.alert("Error actualizando libro");

    } finally {

      setSaving(false);

    }

  };


  /*
  ====================================================
  INTERFAZ
  ====================================================
  */
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
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
      )}

      <Button
        title="Cambiar imagen"
        onPress={pickImage}
      />

      <View style={{ height: 20 }} />

      <Button
        title={saving ? "Guardando..." : "Guardar cambios"}
        onPress={saveBook}
        color="#e75480"
      />

    </View>

  );
}


/*
====================================================
ESTILOS
====================================================
*/

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
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd"
  },

  image: {
    width: 180,
    height: 260,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 8
  }

});