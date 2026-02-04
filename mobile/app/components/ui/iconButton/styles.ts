import { Colors } from "@/app/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    disabled: {
      opacity: .7,
      pointerEvents:'none'
    },
    buttonLoading:{
      minWidth:85
    }
  });
}
