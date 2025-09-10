import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/shared/components/ui/gluestack-ui-provider";
import "@/shared/styles/globals.css";

export default function RootLayout() {
  const isAuthenticated = true;

  return (
    <GluestackUIProvider mode="system">
      <Stack>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(private)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </GluestackUIProvider>
  );
}
