import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/app/components/parallax-scroll-view";
import { ThemedText } from "@/app/components/themed-text";
import { ThemedView } from "@/app/components/themed-view";
import { getAuth } from "@/app/services/firebaseAuth";
import { router } from "expo-router";

export default function HomeScreen() {
  getAuth().onAuthStateChanged((user) => {
    if (!user) {
      router.replace("/(screens)/login/login");
    }
  });

  return (
    <ThemedView style={{ flex: 1 }}></ThemedView>
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
