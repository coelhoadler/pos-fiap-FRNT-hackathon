import { Colors } from "@/app/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    modalLegendWrapper: {
        width:'100%',
        backgroundColor:colors.colorWhite,
    },
    title:{
      color:colors.colorPrimary,
      fontSize:26,
      fontWeight:'bold',
      width:'100%',
      textAlign:'center',
      marginBottom:5
    },
    itemsWrapper:{
      marginTop:15,
      width:'100%',
    },
    item:{
      marginBottom:10,
      width:'100%',
      fontSize:16,
      color:colors.colorPrimary
    }
  });
}
