// app/book-details.tsx
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export const options = {
  title: "Detalles del libro",
};

const StarRating = ({ rating }: { rating: number }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (i < rating ? "★" : "☆")).join("");
  return <Text style={styles.stars}>{stars}</Text>;
};

export default function BookDetails() {
  const params = useLocalSearchParams();
  const totalPages = Number(params.pages_total) || 0;
  const pagesRead = Number(params.pages_read) || 0;
  const percent = totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0;

  // ================== PARSEAR NOTAS ==================
  let personalNotes = "";
  let chapterNotes: Record<string, string> = {};

  // Personal notes: siempre string
  if (params.personal_notes) {
    personalNotes = params.personal_notes as string;
  }

  // Chapter notes: puede venir como string o ya objeto, casteamos seguro
  if (params.chapter_notes) {
    const raw = params.chapter_notes as unknown;
    if (typeof raw === "string") {
      try {
        chapterNotes = JSON.parse(raw) as Record<string, string>;
      } catch (e) {
        console.log("No se pudo parsear chapter_notes JSON:", e);
        chapterNotes = {};
      }
    } else if (typeof raw === "object" && raw !== null) {
      chapterNotes = raw as Record<string, string>;
    }
  }

  const rating = Number(params.rating) || 0;

  return (
    <ScrollView style={styles.container}>
      {/* Nombre y autor */}
      <Text style={styles.line}>
        <Text style={styles.bold}>Nombre del libro: </Text>
        {params.title}
      </Text>
      <Text style={styles.line}>
        <Text style={styles.bold}>Autor: </Text>
        {params.author}
      </Text>
      <Text style={styles.line}>
        <Text style={styles.bold}>Estado: </Text>
        {params.status || "Por leer"}
      </Text>

      {/* Barra de progreso visual */}
      <View style={styles.progressBarWrapper}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFilled, { flex: percent }]} />
          <View style={[styles.progressBarEmpty, { flex: 100 - percent }]} />
        </View>
        <Text style={styles.percent}>
          {pagesRead} / {totalPages} páginas ({percent}%)
        </Text>
      </View>

      {/* Calificación */}
      <StarRating rating={rating} />

      {/* Notas por capítulo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notas por capítulo:</Text>
        {Object.keys(chapterNotes).length === 0 ? (
          <Text>Sin notas por capítulo</Text>
        ) : (
          Object.keys(chapterNotes).map((cap) => (
            <View key={cap} style={styles.noteItem}>
              <Text style={styles.chapter}>Capítulo {cap}:</Text>
              <Text>{chapterNotes[cap] || "-"}</Text>
            </View>
          ))
        )}
      </View>

      {/* Notas personales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notas personales:</Text>
        <Text>{personalNotes || "Sin notas personales"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fde2ea" },
  line: { fontSize: 16, marginBottom: 6 },
  bold: { fontWeight: "bold" },
  stars: { fontSize: 20, color: "#f5c518", marginBottom: 12 },
  section: { marginTop: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  noteItem: { marginBottom: 6 },
  chapter: { fontWeight: "bold" },

  // ================= Barra de progreso =================
  progressBarWrapper: { marginVertical: 10 },
  progressBarContainer: {
    flexDirection: "row",
    height: 16,
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    backgroundColor: "#eee",
  },
  progressBarFilled: { backgroundColor: "#e75480" },
  progressBarEmpty: { backgroundColor: "#eee" },
  percent: { fontSize: 14, fontWeight: "bold", marginTop: 4 },
});