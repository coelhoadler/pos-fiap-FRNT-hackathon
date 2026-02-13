import { Colors } from "@/app/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];
  const { width, height } = Dimensions.get('window');

  return StyleSheet.create({
    detailProject: {
      paddingVertical: 20,
    },
    title: {
      color: colors.colorPrimary,
      fontSize: 24,
      fontWeight: "bold",
      textAlign: 'left',
      width: '100%',
      marginBottom: 14,
    },
    description: {
      fontSize: 18,
      color: colors.text,
      textAlign: 'left',
      width: '100%',
      marginBottom: 14,
    },
    wrapperMessageNoColumn: {
      backgroundColor: colors.colorWhite,
      paddingHorizontal: 30,
      paddingVertical: 25,
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '100%'
    },
    itemMessageNoColumn: {
      display: "flex",
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      marginBottom: 15
    },
    noColumnTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.colorPrimary,
      marginTop: 5
    },
    noColumnDescription: {
      fontSize: 16,
      color: colors.colorPrimary,
      marginTop: 5
    },
    textModalColumn: {
      fontSize: 18,
      fontWeight: 600,
      marginBottom: 15,
      color: colors.colorPrimary
    },
    btnModalColumn: {
      marginTop: 15,
      minWidth: 100,
      margin: "auto",
    }
  });
}
