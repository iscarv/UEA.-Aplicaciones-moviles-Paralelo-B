import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bienvenida a BookNotes 📚</Text>

      <Button title="Cerrar sesión" onPress={() => router.replace("/")} />
    </View>
  );
}
