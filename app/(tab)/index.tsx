import {
  Button,
  ButtonSpinner,
  ButtonText,
} from "@/shared/components/ui/button";
import { Text, View } from "react-native";
import "../../shared/styles/globals.css";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background-50">
      <Text className="text-xl font-bold text-primary-500">
        Bienvenido a FixTrack
      </Text>
      <Button className="p-3">
        <ButtonSpinner color="gray" />
        <ButtonText className="font-medium text-sm ml-2">
          Start to develop!...
        </ButtonText>
      </Button>
    </View>
  );
}
