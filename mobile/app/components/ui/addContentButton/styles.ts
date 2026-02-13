import { Colors } from "@/app/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    contentWrapper:{
      backgroundColor: colors.colorWhite,
      borderRadius:5,
      paddingVertical:7,
      paddingHorizontal:20,
      marginVertical:5
    },
    addContentButton:{
      display:"flex",
      alignItems:'center',
      flexDirection:'row',
      justifyContent:'center',
      gap:7,
    },
    textContent:{
      fontSize:18,
      color:colors.text
    },
  });
}
