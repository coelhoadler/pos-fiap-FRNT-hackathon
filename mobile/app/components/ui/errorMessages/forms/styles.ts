import { Colors } from "@/app/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    formErrorMessage: {
      paddingHorizontal:10
    },
    textFormError:{
      fontSize:15,
      color:colors.error,
      fontWeight:'600'
    }
  });
}
