import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />      {/* Login */}
      <Stack.Screen name="register" options={{ title: "Registro" }} />   {/* Registro */}
      <Stack.Screen name="home" options={{ title: "Home" }} />           {/* Home */}
    </Stack>
  );
}
