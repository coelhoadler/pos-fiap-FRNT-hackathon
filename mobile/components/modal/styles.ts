import { Colors } from "@/constants/theme";
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
    modalContent: {
      backgroundColor: colors.colorPrimary,
      maxWidth: 300,
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
    buttonModal: {
      borderColor: colors.colorWhite,
    },
    buttonModalText: {
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
    }
  });
}
