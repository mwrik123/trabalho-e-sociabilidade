import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="quiz-new" />
      <Stack.Screen name="ranking" />
      <Stack.Screen name="timeline" />
      <Stack.Screen name="simulator" />
      <Stack.Screen name="profiles" />
      <Stack.Screen name="glossary" />
      <Stack.Screen name="credits" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="worker-detail" />
      <Stack.Screen name="_sitemap" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
