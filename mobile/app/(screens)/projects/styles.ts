import { Colors } from "@/app/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container:{
      paddingVertical:20,
    },
    title: {
      color: colors.colorPrimary,
      fontSize: 24,
      fontWeight: "bold",
      textAlign:'left',
      width:'100%',
      marginBottom:20,
    },
  });
}
