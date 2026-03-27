// =====================================================
// IMPORTS
// =====================================================

import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// Servicios backend
import { deleteBook, getBooks } from "../../services/bookService";


// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function MyBooksScreen() {

  const router = useRouter();

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  // =====================================================
  // CARGAR LIBROS
  // =====================================================

  const loadBooks = async () => {

    try {

      const data = await getBooks();

      console.log("📚 Libros recibidos:", data);

      setBooks(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error("❌ Error cargando libros:", error);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // REFRESCO AUTOMÁTICO AL VOLVER A LA PANTALLA
  // =====================================================

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

            loadBooks();

          } catch (error) {

            console.error("❌ Error eliminando libro:", error);

          }

        },

      },

    ]);

  };


  // =====================================================
  // URL IMAGEN
  // =====================================================

  const getImageUrl = (image?: string) => {

    if (!image) return undefined;

    if (image.startsWith("http")) return image;

    return `http://192.168.100.10:3000${image}`;

  };


  // =====================================================
  // RENDER ITEM
  // =====================================================

  const renderItem = ({ item }: { item: any }) => {

    const imageUrl = getImageUrl(item.image);

    return (

      <View style={styles.card}>

        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        )}

        <View style={{ flex: 1 }}>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>{item.author}</Text>

          {/*  BOTONES MEJORADOS */}
          <View style={styles.actions}>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                router.push({
                  pathname: "/edit-book",
                  params: { ...item },
                })
              }
            >
              <Text style={styles.btnText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.btnText}>Eliminar</Text>
            </TouchableOpacity>

          </View>

        </View>

      </View>

    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando libros...</Text>
      </View>
    );
  }


  // =====================================================
  // VACÍO
  // =====================================================

  if (books.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Mis Libros 📚</Text>
        <Text style={styles.empty}>
          📚 Aún no tienes libros
        </Text>
      </View>
    );
  }


  // =====================================================
  // LISTA
  // =====================================================

  return (

    <View style={styles.container}>

      <Text style={styles.header}>Mis Libros 📚</Text>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
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
    padding: 12,
    marginBottom: 15,
    borderRadius: 14,
    elevation: 3,
  },

  image: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  author: {
    marginBottom: 10,
    color: "#555",
  },

  // NUEVOS ESTILOS BOTONES
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },

  editBtn: {
    backgroundColor: "#efa0b4",
    padding: 10,
    borderRadius: 14,
    width: "48%",
    alignItems: "center"
  },

  deleteBtn: {
    backgroundColor: "#ff4d6d",
    padding: 10,
    borderRadius: 14,
    width: "48%",
    alignItems: "center"
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold"
  },

  empty: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 40,
  }

});