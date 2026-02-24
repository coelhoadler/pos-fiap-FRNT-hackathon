import { Colors } from "@/app/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    accordion: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.colorWhite,
    borderWidth:1
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    minHeight: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    padding: 12,
  },
  });
}
