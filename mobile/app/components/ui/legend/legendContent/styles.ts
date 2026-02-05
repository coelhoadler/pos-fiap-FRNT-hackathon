import { Colors } from "@/app/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    legendContent: {
      width: '100%',
      minWidth:'100%',
    },
    subtitle: {
      width: '100%',
      marginBottom: 20,
      fontSize: 18,
      fontWeight: '500',
      textAlign:'left',
      color: colors.text
    },
    wrapperItem: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent:'flex-start',
      gap: 10,
      marginBottom: 10,
      padding: 10,
      backgroundColor:colors.colorSuccess,
      borderRadius:5,
    },
    wrapperIcon: {
      width: '6%',
      marginTop:1
    },
    descriptionItem: {
      fontSize: 16,
      fontWeight: '400',
      color: colors.text,
      textAlign:'left',
      width: '94%',
      maxWidth:'94%',
      paddingRight:5
    },
  });
}
