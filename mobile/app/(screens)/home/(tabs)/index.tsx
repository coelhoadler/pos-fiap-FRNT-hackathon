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
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Boas Vindas!</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
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
