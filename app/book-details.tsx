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

  const getParam = (p: string | string[] | undefined): string =>
    Array.isArray(p) ? p[0] : p ?? "";

  const totalPages = Number(getParam(params.pages_total)) || 0;
  const pagesRead = Number(getParam(params.pages_read)) || 0;
  const percent = totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0;

  const rating = Number(getParam(params.rating)) || 0;

  // ================== PERSONAL NOTES ==================
  const personalNotes = getParam(params.personal_notes);

  // ================== CHAPTER NOTES ==================
  let chapterNotes: Record<string, string> = {};

  const rawChapter = params.chapter_notes;

  try {
    const chapterString = Array.isArray(rawChapter)
      ? rawChapter[0]
      : rawChapter;

    if (chapterString) {
      let parsed: any = JSON.parse(String(chapterString));

      // si viene doble serializado
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      chapterNotes = parsed || {};
    }
  } catch {
    chapterNotes = {};
  }

  // ================== GENRES ==================
  let genres: string[] = [];

  const rawGenres = params.genres;

  try {
    const genreString = Array.isArray(rawGenres)
      ? rawGenres[0]
      : rawGenres;

    if (genreString) {
      let parsed: any = JSON.parse(String(genreString));

      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      genres = Array.isArray(parsed) ? parsed : [parsed];
    }
  } catch {
    genres = [];
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.line}>
        <Text style={styles.bold}>Nombre del libro: </Text>
        {getParam(params.title)}
      </Text>

      <Text style={styles.line}>
        <Text style={styles.bold}>Autor: </Text>
        {getParam(params.author)}
      </Text>

      <Text style={styles.line}>
        <Text style={styles.bold}>Estado: </Text>
        {getParam(params.status) || "Por leer"}
      </Text>

      {/* GENEROS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Géneros</Text>

        {genres.length === 0 ? (
          <Text>Sin géneros</Text>
        ) : (
          genres.map((g, index) => <Text key={index}>• {g}</Text>)
        )}
      </View>

      {/* PROGRESO */}
      <View style={styles.progressBarWrapper}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFilled, { flex: percent }]} />
          <View style={[styles.progressBarEmpty, { flex: 100 - percent }]} />
        </View>

        <Text style={styles.percent}>
          {pagesRead} / {totalPages} páginas ({percent}%)
        </Text>
      </View>

      {/* CALIFICACION */}
      <StarRating rating={rating} />

      {/* NOTAS POR CAPITULO */}
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

      {/* NOTAS PERSONALES */}
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