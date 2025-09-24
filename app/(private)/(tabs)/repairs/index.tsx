import { useUserStore } from "@/shared/stores/useUserStore";
import { Button } from "@react-navigation/elements";
import { StyleSheet, Text, View } from "react-native";

export default function RepairsScreen() {
  const { signOut } = useUserStore();

  return (
    <View style={styles.container}>
      <Text>Repairs Screen</Text>
      <Button onPress={() => signOut()}>Press Me</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
