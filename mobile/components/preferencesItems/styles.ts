import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
    },

    pressed: {
      opacity: 0.85,
    },

    textContainer: {
      flex: 1,
      paddingRight: 12,
    },

    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },

    description: {
      marginTop: 4,
      fontSize: 14,
      color:  colors.text,
    },
  });
}
