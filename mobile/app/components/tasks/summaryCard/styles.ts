import { Colors } from "@/app/constants/theme";
import { StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      width: "100%",
      paddingHorizontal: 15,
      paddingVertical: 15,
      backgroundColor: colors.colorPrimary,
      borderRadius: 5,
      
    },
    wrapper: {},
    header: {
      borderBottomWidth: 1,
      borderBottomColor: colors.colorWhite,
      width: "100%",
      paddingBottom: 8,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    title: {
      color: colors.colorWhite, fontSize: 16
    },
    headerIconWrapper: {
      display: "flex",
      alignItems: "center",
      flexDirection:'row',
      gap:10
    },
    body: {
      paddingTop: 10
    },
    description: {
      color: colors.colorWhite
    },
    wrapperInfos: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    infosItem: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      flexDirection: "row",
    },
    textInfo: {
      color: colors.colorWhite,
      fontSize: 13,
    }
  });
}
