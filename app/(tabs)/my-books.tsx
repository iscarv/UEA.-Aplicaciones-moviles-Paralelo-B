import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { deleteBook, getBooks, updateBook } from "../../services/bookService";

const GENRES = [
  "Todos",
  "Misterio",
  "Romance",
  "Fantasía",
  "Ciencia ficción",
  "Terror",
  "Aventura",
  "Drama",
  "Historia",
];

export default function MyBooksScreen() {
  const router = useRouter();

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");

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

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  const removeBook = async (id: number) => {
    if (Platform.OS === "web") {
      const confirmDelete = window.confirm("¿Eliminar este libro?");
      if (!confirmDelete) return;

      try {
        await deleteBook(id);
        alert("Libro eliminado correctamente");
        loadBooks();
      } catch (error) {
        console.error("❌ Error eliminando libro:", error);
      }
    } else {
      Alert.alert("Eliminar libro", "¿Está seguro?", [
        { text: "Cancelar" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteBook(id);
              Alert.alert("Libro eliminado correctamente");
              loadBooks();
            } catch (error) {
              console.error("❌ Error eliminando libro:", error);
            }
          },
        },
      ]);
    }
  };

  const toggleFavorite = async (book: any) => {
    try {
      const newValue = book.favorite ? 0 : 1;
      await updateBook(book.id, { favorite: newValue });

      if (Platform.OS === "web") {
        alert(newValue ? "Añadido a favoritos ⭐" : "Eliminado de favoritos");
      } else {
        Alert.alert(
          "Favoritos",
          newValue ? "Añadido a favoritos ⭐" : "Eliminado de favoritos"
        );
      }

      loadBooks();
    } catch (error) {
      console.error("❌ Error actualizando favorito:", error);
    }
  };

  const getImageUrl = (image?: string) => {
    if (!image) return undefined;

    const base = image.startsWith("http")
      ? image
      : `http://192.168.100.10:3000${image}`;

    return `${base}?cache=${Date.now()}`;
  };

  /* FILTRO DE LIBROS */
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesFavorite = showFavorites ? book.favorite : true;

    let bookGenres: string[] = [];

    if (!book.genres) {
      bookGenres = [];
    } else {
      try {
        bookGenres = JSON.parse(book.genres);
      } catch {
        bookGenres = [book.genres];
      }
    }

    const matchesGenre =
      selectedGenre === "Todos" || bookGenres.includes(selectedGenre);

    return matchesSearch && matchesFavorite && matchesGenre;
  });

  const renderItem = ({ item }: { item: any }) => {
    const imageUrl = getImageUrl(item.image);

    const total = Number(item.pages_total) || 0;
    const read = Number(item.pages_read) || 0;
    const percent = total > 0 ? Math.round((read / total) * 100) : 0;

    let genres: string[] = [];

    if (!item.genres) {
      genres = [];
    } else {
      try {
        genres = JSON.parse(item.genres);
      } catch {
        genres = [item.genres];
      }
    }

    const stars = [];
    const rating = Math.round(item.rating || 0);

    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? "⭐" : "☆");
    }

    return (
      <View style={styles.card}>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>{item.author}</Text>

          {genres.length > 0 && (
            <Text style={styles.genres}>{genres.join(" • ")}</Text>
          )}

          <Text style={styles.status}>
            Estado: {item.status || "Por leer"}
          </Text>

          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFilled, { flex: percent }]} />
              <View style={[styles.progressBarEmpty, { flex: 100 - percent }]} />
            </View>
            <Text style={styles.percent}>{percent}% leído</Text>
          </View>

          <Text style={styles.stars}>{stars.join(" ")}</Text>

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

            {/* BOTÓN DETALLES (CORREGIDO) */}
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() =>
                router.push({
                  pathname: "/book-details",
                  params: {
                    ...item,
                    chapter_notes: JSON.stringify(item.chapter_notes ?? {}),
                    genres: JSON.stringify(item.genres ?? []),
                    personal_notes: item.personal_notes ?? "",
                  },
                })
              }
            >
              <Text style={styles.btnText}>Más detalles</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => removeBook(item.id)}
          >
            <Text style={styles.deleteText}>🗑 Eliminar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(item)}
          >
            <Text style={styles.favoriteText}>
              {item.favorite
                ? "⭐ Quitar de favoritos"
                : "⭐ Añadir a favoritos"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando libros...</Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Mis Libros 📚</Text>
        <Text style={styles.empty}>📚 Aún no tienes libros</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Libros 📚</Text>

      <TextInput
        placeholder="Buscar libro o autor..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={!showFavorites ? styles.filterActive : styles.filterBtn}
          onPress={() => setShowFavorites(false)}
        >
          <Text>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={showFavorites ? styles.filterActive : styles.filterBtn}
          onPress={() => setShowFavorites(true)}
        >
          <Text>Favoritos ⭐</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.genreFilter}>
        {GENRES.map((genre) => (
          <TouchableOpacity
            key={genre}
            style={
              selectedGenre === genre
                ? styles.genreActive
                : styles.genreBtn
            }
            onPress={() => setSelectedGenre(genre)}
          >
            <Text>{genre}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fde2ea" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e75480",
    marginBottom: 10,
    textAlign: "center",
  },
  search: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    gap: 10,
  },
  filterBtn: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
  },
  filterActive: {
    backgroundColor: "#efa0b4",
    padding: 8,
    borderRadius: 10,
  },
  genreFilter: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 12,
    gap: 6,
  },
  genreBtn: {
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 8,
  },
  genreActive: {
    backgroundColor: "#efa0b4",
    padding: 6,
    borderRadius: 8,
  },
  genres: {
    fontSize: 12,
    color: "#777",
    marginBottom: 4,
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
  title: { fontSize: 16, fontWeight: "bold" },
  author: { marginBottom: 2, color: "#555" },
  status: { fontSize: 12, marginBottom: 4 },
  stars: { fontSize: 16, marginBottom: 6 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  editBtn: {
    backgroundColor: "#efa0b4",
    padding: 10,
    borderRadius: 14,
    width: "48%",
    alignItems: "center",
  },
  detailsBtn: {
    backgroundColor: "#7fbfff",
    padding: 10,
    borderRadius: 14,
    width: "48%",
    alignItems: "center",
  },
  deleteBtn: {
    marginTop: 6,
    backgroundColor: "#ff6b6b",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
  favoriteBtn: {
    marginTop: 8,
    backgroundColor: "#fff3c4",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  favoriteText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 40,
  },
  progressBarWrapper: { marginVertical: 6 },
  progressBarContainer: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    width: "100%",
    backgroundColor: "#eee",
  },
  progressBarFilled: { backgroundColor: "#e75480" },
  progressBarEmpty: { backgroundColor: "#eee" },
  percent: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
  },
});