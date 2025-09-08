import { GluestackUIProvider } from "@/shared/components/ui/gluestack-ui-provider";
import "@/shared/styles/globals.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import "../shared/styles/globals.css";

function LayoutContainer({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}} className="bg-background-50">
      {children}
    </View>
  );
}

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="system">
      <SafeAreaProvider>
        <LayoutContainer>

          <Stack>

            <Stack.Screen name="(tab)" options={{ headerShown: false }}/>
            
            <Stack.Screen name="auth" options={{ headerShown: false }}/>
            
          </Stack>

        </LayoutContainer>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
