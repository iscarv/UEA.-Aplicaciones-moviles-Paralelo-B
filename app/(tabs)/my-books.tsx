// =====================================================
// IMPORTS
// =====================================================

import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Servicios para comunicarse con el backend
import { deleteBook, getBooks } from "../../services/bookService";



// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function MyBooksScreen() {

  const router = useRouter();

  // estado donde guardamos los libros
  const [books, setBooks] = useState<any[]>([]);

  // estado de carga
  const [loading, setLoading] = useState(true);



  // =====================================================
  // CARGAR LIBROS DESDE EL BACKEND
  // =====================================================

  const loadBooks = async () => {

    try {

      const data = await getBooks();

      // Log útil para depurar si algo falla
      console.log("Libros recibidos:", data);

      setBooks(data);

    } catch (error) {

      console.error("Error cargando libros:", error);

    } finally {

      setLoading(false);

    }

  };



  /*
  =====================================================
  useFocusEffect
  =====================================================

  Esta función hace que la pantalla se actualice
  cada vez que volvemos desde "Agregar libro".

  Así los libros nuevos aparecen automáticamente.
  */

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );



  // =====================================================
  // ELIMINAR LIBRO
  // =====================================================

  const handleDelete = (id: number) => {

    Alert.alert("Eliminar libro", "¿Está seguro?", [

      { text: "Cancelar" },

      {
        text: "Eliminar",

        onPress: async () => {

          try {

            await deleteBook(id);

            // recargar lista después de eliminar
            loadBooks();

          } catch (error) {

            console.error("Error eliminando libro:", error);

          }

        },

      },

    ]);

  };



  /*
  =====================================================
  FUNCIÓN PARA CORREGIR URL DE IMÁGENES
  =====================================================

  El backend puede devolver:

  /uploads/imagen.jpg

  Entonces lo convertimos en:

  http://192.168.100.10:3000/uploads/imagen.jpg
  */

  const getImageUrl = (image?: string) => {

    if (!image) return undefined;

    // Si ya es URL completa no la modificamos
    if (image.startsWith("http")) return image;

    // Convertimos ruta relativa a URL completa
    return `http://192.168.100.10:3000${image}`;

  };



  // =====================================================
  // RENDER DE CADA LIBRO
  // =====================================================

  const renderItem = ({ item }: { item: any }) => {

    const imageUrl = getImageUrl(item.image);

    return (

      <View style={styles.card}>

        {/* 
        Mostrar imagen SOLO si existe URL válida
        Esto evita errores en React Native Image
        */}
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        ) : null}


        {/* Contenedor de información */}
        <View style={{ flex: 1 }}>

          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.author}>{item.author}</Text>


          {/* Botón eliminar */}
          <Button
            title="Eliminar"
            color="#e75480"
            onPress={() => handleDelete(item.id)}
          />


          {/* Botón editar */}
          <Button
            title="Editar"
            onPress={() =>
              router.push({
                pathname: "/edit-book",
                params: { ...item },
              })
            }
          />

        </View>

      </View>

    );

  };



  // =====================================================
  // ESTADO DE CARGA
  // =====================================================

  if (loading) {

    return (
      <View style={styles.container}>
        <Text>Cargando libros...</Text>
      </View>
    );

  }



  // =====================================================
  // LISTA VACÍA
  // =====================================================

  if (books.length === 0) {

    return (

      <View style={styles.container}>

        <Text style={styles.header}>Mis Libros 📚</Text>

        <Text style={styles.empty}>
          📚 Aún no tienes libros guardados
        </Text>

        <Text style={styles.emptySub}>
          Agrega uno en "Agregar libro"
        </Text>

      </View>

    );

  }



  // =====================================================
  // LISTA DE LIBROS
  // =====================================================

  return (

    <View style={styles.container}>

      <Text style={styles.header}>Mis Libros 📚</Text>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}

        // mejora visual cuando hay pocos elementos
        contentContainerStyle={{ paddingBottom: 40 }}
      />

    </View>

  );

}



// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fde2ea",
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e75480",
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },

  image: {
    width: 70,
    height: 100,
    borderRadius: 6,
    marginRight: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  author: {
    marginBottom: 10,
    color: "#555",
  },

  empty: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 40,
  },

  emptySub: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
  },

});