import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    buttonBg: {
      paddingHorizontal:20,
      paddingVertical:8,
      borderRadius:7,
      borderWidth:1,
    },
    buttonPrimary:{
      backgroundColor: colors.buttonBackground,
      borderColor: colors.borderButton
    },
    buttonOutline:{
      backgroundColor: 'transparent',
      borderColor: colors.borderButton,
    },
    text:{
      fontSize:16,
      textAlign:'center',
      fontWeight:'500',
    },
    textPrimary:{
      color: colors.textButton
    },

    textOutline:{
      color: colors.textButtonOutline
    },
    disabled: {
      opacity: .7,
      pointerEvents:'none'
    }
  });
}
