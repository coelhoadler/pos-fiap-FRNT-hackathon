import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
  });
}
