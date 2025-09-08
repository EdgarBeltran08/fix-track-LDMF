import { Redirect } from "expo-router";

export default function Index() {
  const isAuthenticated = false; // Replace with your actual authentication logic

  if (isAuthenticated) {
    return <Redirect href="/(private)/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
}
