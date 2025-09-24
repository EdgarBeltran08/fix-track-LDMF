import { GluestackUIProvider } from "@/shared/components/ui/gluestack-ui-provider";
import { useUserStore } from "@/shared/stores/useUserStore";
import "@/shared/styles/globals.css";
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
  const { colorScheme } = useColorScheme();

  const backgroundColor = colorScheme === "dark" ? "#0d0d0d" : "#f2f2f2";

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor,
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
