import { Colors } from "@/app/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    wrapper:{
      paddingVertical:10,
      paddingHorizontal:15,
      backgroundColor: colors.colorPrimary,
      width:'100%',
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      borderRadius:5,
      marginBottom:10,
      maxHeight:55,
    },
    actionsWrapper:{
      display:'flex',
      flexDirection:'row',
      gap:10,
      height:'100%',
      alignItems:'center',
    },
    actionItem:{
      width:26,
      height:'100%',
      padding:5,
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
    },
    title:{
      color: colors.colorWhite,
      fontSize:18,
      fontWeight:'bold',
    }
  });
}
