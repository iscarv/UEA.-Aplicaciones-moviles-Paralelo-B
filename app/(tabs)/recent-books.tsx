import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { getRecentBooks } from "../../services/bookService";

export default function RecentBooksScreen() {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    try {
      const data = await getRecentBooks(5);
      setBooks(Array.isArray(data) ? data.slice(0, 5) : []); // Limitar a 5
    } catch (error) {
      console.error("❌ Error cargando lecturas recientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  const getImageUrl = (image?: string) => {
    if (!image) return undefined;
    const base = image.startsWith("http")
      ? image
      : `http://192.168.100.10:3000${image}`;
    return `${base}?cache=${Date.now()}`;
  };

  const parseGenres = (raw: any) => {
    let genres: string[] = [];
    try {
      if (raw) {
        let parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (typeof parsed === "string") parsed = JSON.parse(parsed);
        genres = Array.isArray(parsed) ? parsed : [parsed];
      }
    } catch {
      genres = [];
    }
    return genres;
  };

  const parseChapterNotes = (raw: any) => {
    let chapters: Record<string, string> = {};
    try {
      if (raw) {
        let parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (typeof parsed === "string") parsed = JSON.parse(parsed);
        chapters = parsed && typeof parsed === "object" ? parsed : {};
      }
    } catch {
      chapters = {};
    }
    return chapters;
  };

  const renderItem = ({ item }: { item: any }) => {
    const imageUrl = getImageUrl(item.image);

    const total = Number(item.pages_total) || 0;
    const read = Number(item.pages_read) || 0;
    const percent = total > 0 ? Math.round((read / total) * 100) : 0;

    const genres = parseGenres(item.genres);
    const chapters = parseChapterNotes(item.chapter_notes);

    const stars = [];
    const rating = Math.round(item.rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? "⭐" : "☆");
    }

    const updatedAt = new Date(item.updated_at).toLocaleString();

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/book-details",
            params: {
              ...item,
              chapter_notes: Object.keys(chapters).length > 0 ? JSON.stringify(chapters) : undefined,
              personal_notes: item.personal_notes ?? "",
              genres: genres.length > 0 ? JSON.stringify(genres) : undefined,
            },
          })
        }
      >
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>{item.author}</Text>

          {genres.length > 0 && (
            <Text style={styles.genres}>{genres.join(" • ")}</Text>
          )}

          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFilled, { flex: percent }]} />
              <View style={[styles.progressBarEmpty, { flex: 100 - percent }]} />
            </View>
            <Text style={styles.percent}>{percent}% leído</Text>
          </View>

          <Text style={styles.stars}>{stars.join(" ")}</Text>

          <Text style={styles.updated}>Última actualización: {updatedAt}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando lecturas recientes...</Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No hay lecturas recientes</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fde2ea" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 14,
    elevation: 3,
  },
  image: { width: 70, height: 100, borderRadius: 8, marginRight: 12 },
  title: { fontSize: 16, fontWeight: "bold" },
  author: { marginBottom: 2, color: "#555" },
  genres: { fontSize: 12, color: "#777", marginBottom: 4 },
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
  percent: { fontSize: 12, fontWeight: "bold", marginTop: 2 },
  stars: { fontSize: 16, marginBottom: 4 },
  updated: { fontSize: 12, color: "#555", marginTop: 4 },
  empty: { textAlign: "center", fontSize: 18, marginTop: 40 },
});