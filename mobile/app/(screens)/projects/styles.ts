import { Colors } from "@/app/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];
  const { width, height } = Dimensions.get('window');

  return StyleSheet.create({
    container: {
      paddingVertical: 20,
    },
    dropdownBackDrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 5,
    },

    title: {
      color: colors.colorPrimary,
      fontSize: 24,
      fontWeight: "bold",
      textAlign: 'left',
      width: '100%',
      marginBottom: 14,
    },
    modalLoading:{
      width:'100%',
      height:'100%',
      position:'relative',
      top:-80
    }
    
  });
}
