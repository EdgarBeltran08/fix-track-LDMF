import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? "#333333" : "#FFFFFF", // background-0
          borderTopColor: isDark ? "#374151" : "#E5E7EB", // background-200
        },
        headerStyle: {
          backgroundColor: isDark ? "#333333" : "#FFFFFF", // background-0
        },
        headerTintColor: isDark ? "#F9FAFB" : "#333333", // typography-900
        tabBarActiveTintColor: isDark ? "#3B82F6" : "#3B82F6", // primary-500
        tabBarInactiveTintColor: isDark ? "#9CA3AF" : "#6B7280", // typography-500
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
