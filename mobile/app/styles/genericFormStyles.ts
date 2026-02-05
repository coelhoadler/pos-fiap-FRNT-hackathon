import { Colors } from "@/app/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export const genericFormStyles = (colorScheme: "light" | "dark") => {
  const colors = Colors[colorScheme];
  const { width, height } = Dimensions.get('window');

  return StyleSheet.create({
    defaultItemWrapper: {
      display:'flex',
      gap:10,
      marginHorizontal: 3,
    },
    defaultItem: {
      fontSize: 16,
      borderRadius:5,
      paddingHorizontal:10,
      paddingVertical:10,
      marginBottom:10,
      backgroundColor:colors.colorWhite,
      shadowColor: colors.colorBlack,
      shadowOffset: {
        width: 0,
        height:4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    defaultLabel: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500'
    },
  });
};
