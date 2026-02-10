import { Colors } from "@/app/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    wrapper: {
      marginTop:10
    },
    content: {
      backgroundColor: colors.colorWhite,
      paddingHorizontal:20,
      paddingVertical:30,
      borderRadius: 10,
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
    },
    messageWrapper:{
      display:"flex",
      alignItems:'center',
      justifyContent:'center',
      gap:5,
      marginBottom:15
    },
    addProjectButton:{
      display:"flex",
      alignItems:'center',
      flexDirection:'row',
      justifyContent:'center',
      gap:7,
      marginTop:15,
    },
    textAddProject:{
      fontSize:18,
      color:colors.text
    },
    messageText:{
      fontSize:22,
      fontWeight:'700',
      color:colors.error,
      marginTop:5
    }
  });
}
