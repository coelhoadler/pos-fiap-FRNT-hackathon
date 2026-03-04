import { Colors } from "@/app/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];
  const { width, height } = Dimensions.get('window');

  return StyleSheet.create({
    container: {
      paddingVertical: 20,
      paddingBottom: 20,
      
    },

    title: {
      color: colors.colorPrimary,
      fontSize: 28,
      fontWeight: "bold",
      textAlign: 'left',
      width: '100%',
      marginBottom: 20,
    },

    scrollView: {
      width: '100%',
    },

    introContainer: {
      marginBottom: 10,
    },

    subtitle: {
      fontSize: 22,
      marginBottom: 8,
      color: colors.colorPrimary,
      textAlign: 'left',
      fontWeight: '600',
      width: '100%',
    },

    introText: {
      fontSize: 18,
      color: colors.text,
      lineHeight: 26,
      marginBottom: 0,
    },

    button: {
      margin: 'auto',
      marginTop: 40
    },


  });
}
