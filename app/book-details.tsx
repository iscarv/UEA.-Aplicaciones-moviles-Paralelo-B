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
  const progressBar = "█".repeat(Math.round(percent / 10)) + "░".repeat(10 - Math.round(percent / 10));

  // ================== PARSEAR NOTAS ==================
  let personalNotes = "";
  let chapterNotes: Record<string, string> = {};
  
  if (params.personal_notes) {
    personalNotes = params.personal_notes as string;
  }

  if (params.chapter_notes) {
    try {
      chapterNotes = JSON.parse(params.chapter_notes as string);
    } catch (e) {
      console.log("No se pudo parsear chapter_notes JSON:", e);
      chapterNotes = {};
    }
  }

  const rating = Number(params.rating) || 0;

  return (
    <ScrollView style={styles.container}>
      {/* Nombre y autor en negrita */}
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

      <Text style={styles.progressBar}>{progressBar}</Text>
      <Text style={styles.percent}>
        {pagesRead} / {totalPages} páginas ({percent}%)
      </Text>

      <StarRating rating={rating} />

      {/* Notas por capítulo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notas por capítulo:</Text>
        {Object.keys(chapterNotes).length === 0 ? (
          <Text>Sin notas por capítulo</Text>
        ) : (
          Object.entries(chapterNotes).map(([chapter, note]) => (
            <View key={chapter} style={styles.noteItem}>
              <Text style={styles.chapter}>Capítulo {chapter}:</Text>
              <Text>{note}</Text>
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
  status: { fontSize: 14, marginBottom: 10 },
  progressBar: { fontFamily: "monospace", fontSize: 16, marginBottom: 4 },
  percent: { fontSize: 14, fontWeight: "bold", marginBottom: 10 },
  stars: { fontSize: 20, color: "#f5c518", marginBottom: 12 },
  section: { marginTop: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  noteItem: { marginBottom: 6 },
  chapter: { fontWeight: "bold" },
});