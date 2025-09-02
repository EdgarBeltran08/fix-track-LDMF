import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/shared/components/ui/gluestack-ui-provider";
import "@/shared/styles/globals.css";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="system">
      <Stack />
    </GluestackUIProvider>
  );
}
