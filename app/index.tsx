import {
  Button,
  ButtonSpinner,
  ButtonText,
} from "@/shared/components/ui/button";
import { useRouter } from 'expo-router';
import { Text, View } from "react-native";
import "../shared/styles/globals.css";

export default function Index() {
  const router = useRouter();


  const handleNavigateToOtherScreen = () => {
    router.push('/inventory_ui');
  };

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


      {/* Botón para navegar a otra pantalla */}
      <Button className="p-3 mt-4" onPress={handleNavigateToOtherScreen}>
      
        <ButtonText className="font-medium text-sm">
          Ir a Inventario
        </ButtonText>
      </Button>
    
    </View>
  );
}
