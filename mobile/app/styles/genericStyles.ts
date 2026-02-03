import { Colors } from "@/app/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export const genericStyle = (colorScheme: "light" | "dark") => {
  const colors = Colors[colorScheme];
  const { width, height } = Dimensions.get('window');

  return StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      width:width,
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
