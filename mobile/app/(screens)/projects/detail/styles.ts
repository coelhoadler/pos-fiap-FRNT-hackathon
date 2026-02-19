import { Colors } from "@/app/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];
  const { width, height } = Dimensions.get('window');

  return StyleSheet.create({
    detailProject: {
      paddingVertical: 20,
      position:'relative',
      minHeight:'100%'
    },
    containerColumn: {
      minWidth: "100%",
      paddingBottom: 100
    },

    actionsColumn: {
      marginBottom: 10,
      borderRadius: 8,
      backgroundColor: colors.colorWhite,
      borderWidth: 1,
      borderColor: colors.colorPrimary,
      width: 50,
      minHeight: 50,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
    },

    wrapperColumn: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
    },
    title: {
      color: colors.colorPrimary,
      fontSize: 24,
      fontWeight: "bold",
      textAlign: 'left',
      width: '100%',
      marginBottom: 14,
    },
    description: {
      fontSize: 18,
      color: colors.text,
      textAlign: 'left',
      width: '100%',
      marginBottom: 14,
    },
    wrapperMessageNoColumn: {
      backgroundColor: colors.colorWhite,
      paddingHorizontal: 30,
      paddingVertical: 25,
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '100%'
    },
    itemMessageNoColumn: {
      display: "flex",
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      marginBottom: 15
    },
    noColumnTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.colorPrimary,
      marginTop: 5
    },
    noColumnDescription: {
      fontSize: 16,
      color: colors.colorPrimary,
      marginTop: 5
    },
    textModalColumn: {
      fontSize: 18,
      fontWeight: 600,
      marginBottom: 15,
      marginTop: 0,
      color: colors.colorPrimary
    },
    textModalColumnDescription: {
      fontSize: 16,
      paddingHorizontal:3,
      marginTop:5,
      color: colors.text
    },
    btnModalColumn: {
      marginTop: 15,
      minWidth: 100,
      margin: "auto",
    },
    optionsModalAddColumn: {
      marginBottom: 15,
      width: "100%",
      gap: 8,
    },
    errorWrapper: {
      marginBottom: 15,
      width: '100%'
    },
    itemModalAddColumn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.colorPrimary,
      backgroundColor: "transparent"
    },
    isSelectedItemModalAddColumn: {
      borderColor: colors.colorPrimary,
      backgroundColor: colors.colorPrimary + "10"
    },
    textItemModalAddColumn: {
      color: colors.text,
    },
  });
}
