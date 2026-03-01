import { Colors } from "@/app/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];
  const { width, height } = Dimensions.get('window');

  return StyleSheet.create({
    container: {
      paddingVertical: 20,
    },
    formContainer: {
      width: '100%',
      height: '100%',
    },

    title: {
      color: colors.colorPrimary,
      fontSize: 24,
      fontWeight: "bold",
      textAlign: 'left',
      
      marginBottom: 14,
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 6,
      color: colors.text,
    },
    wrapperDetail: {
      gap: 24,
      paddingVertical: 10
    },
    wrapperDescripionTitle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    wrapperDescripionContent: {
      backgroundColor: colors.background,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.colorPrimary,
    },

    descriptionText: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
    },
    othersInfosWrapper: {
      gap: 16,
      width: '100%'
    },
    otherInfosItems: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    otherInfosItem: {

    },
    otherInfosicon: {
      backgroundColor: colors.colorPrimary + "15",
      padding: 8,
      borderRadius: 6,
    },
    otherInfosLabel: {
      color: colors.text + "90",
      fontSize: 12,
      marginBottom: 1
    },
    otherInfosTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
    },
    actionsWrapper:{
      flexDirection:'row',
      gap:10,
      backgroundColor:'transparent',
    }


  });
}
