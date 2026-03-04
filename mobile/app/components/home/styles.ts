import { Colors } from "@/app/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    card: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 16,
      marginBottom: 20,
      backgroundColor: colors.colorWhite,
      borderWidth: 2,
      borderColor: colors.colorPrimary,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    cardTitle: {
      fontSize: 20,
      color: colors.colorPrimary,
      textAlign: 'left',
      fontWeight: 'bold',
      marginLeft: 12,
      flex: 1,
    },
    cardDescription: {
      fontSize: 16,
      lineHeight: 24,
    },
    cardBody: {
     
    },
    cardFooter: {
      maxWidth: 125,
      // marginHorizontal: 'auto',
      marginTop: 15,
      marginBottom: 5,
    },
    cardIcons: {
      
    },
    cardIcon: {},
  });
}
