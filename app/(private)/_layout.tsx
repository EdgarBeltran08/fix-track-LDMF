import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

export default function PrivateLayout() {
  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? "#333333" : "#FFFFFF",
        },
        headerTintColor: isDark ? "#F9FAFB" : "#333333",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
