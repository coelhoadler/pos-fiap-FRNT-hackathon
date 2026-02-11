import { Colors } from "@/app/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];
  const { width, height } = Dimensions.get('window');

  return StyleSheet.create({
    container: {
      paddingVertical: 20,
    },
    formContainer: {
      width: '100%',
      height: '100%',
    },

    title: {
      color: colors.colorPrimary,
      fontSize: 24,
      fontWeight: "bold",
      textAlign: 'left',
      width: '100%',
      marginBottom: 14,
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 6,
      color: colors.text,
    },
    form: {
      marginVertical: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    },
    button: {
      margin: 'auto',
      marginTop: 10
    }

  });
}
