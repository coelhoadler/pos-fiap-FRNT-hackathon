import { ThemedView } from "@/app/components/themed-view";
import React from "react";
import { StyleSheet } from "react-native";

// This screen is never shown — the tab button opens the hamburger drawer instead.
export default function MenuScreen() {
  return <ThemedView style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
