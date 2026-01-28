import { Colors } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];
  const { width, height } = Dimensions.get('window');

  return StyleSheet.create({
    containerPreferences: {
      position: 'relative',
      paddingHorizontal: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },

    description: {
      marginTop: 2,
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
    },
    toogleWrapper: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 3,
      width: (width / 2) - 15,
    },
    wrapperItem: {
      display: 'flex',
      alignContent: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginBottom: 20,
      width: width - 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      gap: 10,
    },
    item: {
      width: (width / 2) - 15,
    },
    textToggle: {
      fontSize: 14,
      color: colors.text,
      textAlign: 'center',
    },
    actionsWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      gap: 10,
      width: '100%',
      paddingVertical: 20,
      backgroundColor: colors.background
    },
    warningMessage: {
      fontSize: 16,
      color: colors.colorWhite,
      textAlign: 'center',
      marginBottom: 10,
    },
    warningMessageSmall: {
      fontSize: 14,
    }
  });
}
