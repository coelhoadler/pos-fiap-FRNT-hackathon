import { Colors } from "@/app/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];
  const { width, height } = Dimensions.get('window');

  return StyleSheet.create({
    container: {
      paddingVertical: 20,
      paddingBottom: 60
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
      width: '100%',
      marginBottom: 14,
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 6,
      color: colors.text,
    },
    form: {
      marginVertical: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    },
    button: {
      margin: 'auto',
      marginTop: 10
    },
    selectedItems: {
      gap: 15, marginVertical: 10, marginHorizontal: 6
    },
    selectedItem: {
      borderBottomColor: colors.colorPrimary,
      borderBottomWidth: 1,
      paddingBottom: 10,
    },
    selectedItemBody: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 5
    },
    selectedItemBodyText: {
      fontSize: 16,
      color: colors.text
    },
    titleModalOptions: {
      fontSize: 20,
      textAlign: 'center',
      color: colors.colorPrimary,
      fontWeight: 700,
      marginBottom: 10
    },
    modalOptions: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderColor: colors.text,
    },
    modalOptionsText: {
      fontSize: 16,
      color: colors.text
    },
    modalOptionsButton: {
      marginTop: 30,
      marginBottom: 10,
      width: "50%",
      marginHorizontal: "auto",
    },
    modalOptionsSubtitle: {
      color: colors.text,
      marginBottom: 5,
      paddingHorizontal: 8,
    },
    modalOptionsWrapperInfos: {
      padding: 10,
      borderRadius: 5,
      width: "92%",
    },
    modalOptionsInfosText:{
      fontSize:16,
     color: colors.text
    },
    modalButton:{
      width:'70%',
      marginHorizontal:'auto', 
      marginTop: 20,
      marginBottom: 10,
    }

  });
}
