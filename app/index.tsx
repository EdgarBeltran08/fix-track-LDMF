import { Link } from "expo-router";
import { Text, View } from "react-native";
import "../shared/styles/globals.css";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background-51">
      <Link href={"/agregar"}>Agregar equipo</Link>
      <Text className="text-xl font-bold text-primary-500">
        Bienvenido a FixTrack
      </Text>
    </View>
  );
}
