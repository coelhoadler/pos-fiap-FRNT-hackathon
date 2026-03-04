import { ThemedView } from "@/app/components/themed-view";
import { getAuth } from "@/app/services/firebaseAuth";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import HomePage from "../home-page";

export default function HomeScreen() {
  getAuth().onAuthStateChanged((user) => {
    if (!user) {
      router.replace("/(screens)/login/login");
    }
  });

  return (
    <ThemedView style={{ flex: 1 }}>
      <HomePage />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
