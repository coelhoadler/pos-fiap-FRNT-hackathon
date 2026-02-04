import { Colors } from "@/app/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];
  const { width, height } = Dimensions.get('window');

  return StyleSheet.create({
    modalContainer: {
      height: '100%',
      width: width,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
    modalContainerLegend:{
      justifyContent: 'flex-start',
      top:20,
      paddingTop:60
    },
    modalContent: {
      backgroundColor: colors.colorPrimary,
      maxWidth: 340,
      padding: 20,
      borderRadius: 10,
      zIndex: 5,
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'flex-end',
      marginBottom: 15,
    },
    textBody: {
      color: colors.colorWhite,
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 10,
    },
    modalActionsButtons: {
      marginTop: 20,
      display: "flex",
      alignItems: "center",
      marginBottom: 10,
    },
    modalActionsButtonsTwoOptions: {
      flexDirection: "row", 
      justifyContent: "center", 
      gap: 10,
      flexWrap: "wrap",
    },
    buttonModal: {
      borderColor: colors.colorWhite,
      backgroundColor: colors.colorWhite,
    },
    buttonModalOutline: {
      borderColor: colors.colorWhite,
    },
    buttonModalText: {
      color: colors.colorPrimary,
    },
    buttonModalTextOutline: {
      color: colors.colorWhite,
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.09)',
      height: height,
      width: '100%',
      minWidth: '100%',
      position: 'absolute',
      top: -20,
      left: 0,
      right: 0,
    },
    loadingContent:{
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 15,
    },
    loadingText:{
      fontSize:16,
      color: colors.colorPrimary,
    },
  });
}
