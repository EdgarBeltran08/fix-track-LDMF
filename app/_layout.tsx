import { GluestackUIProvider } from "@/shared/components/ui/gluestack-ui-provider";
import { useUserStore } from "@/shared/stores/useUserStore";
import "@/shared/styles/globals.css";
import { LinearGradient } from "expo-linear-gradient"; // Asegúrate de importar esto
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function LayoutContainer({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme(); // Hook para detectar el tema

  // Comprobamos si el tema es "dark"
  const isDark = colorScheme === "dark";

  // Si es modo noche, usamos el degradado
  if (isDark) {
    return (
      <LinearGradient
        colors={["#185744", "#0B2419"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {children}
      </LinearGradient>
    );
  }

  // Si no, usamos el fondo sólido de siempre para el modo claro
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: "#f2f2f2", // Color de fondo para modo claro
      }}
    >
      {children}
    </View>
  );
}

export default function RootLayout() {
  const { isAuthenticated } = useUserStore();

  return (
    <GluestackUIProvider mode="system">
      <SafeAreaProvider>
        <LayoutContainer>
          <Stack>
            <Stack.Protected guard={isAuthenticated}>
              <Stack.Screen name="(private)" options={{ headerShown: false }} />
            </Stack.Protected>

            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack.Protected>

            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </LayoutContainer>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
