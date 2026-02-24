import { Colors } from "@/app/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    wrapper: {
      marginTop:10
    },
    content: {
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
    },
    messageWrapper:{
      display:"flex",
      alignItems:'center',
      justifyContent:'center',
      gap:5,
      marginBottom:15
    },
    messageText:{
      fontSize:20,
      fontWeight:'700',
      color:colors.error,
      marginTop:5
    }
  });
}
