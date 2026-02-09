import { Colors } from "@/app/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export function createStyles(colorScheme: "light" | "dark" = "dark") {
  const colors = Colors[colorScheme];
  const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

  return StyleSheet.create({
    dropdownWrapper: {
      position: "absolute",
      top: 46,
      right: -15,
      backgroundColor: colors.colorWhite,
      paddingHorizontal: 8,
      paddingBottom: 8,
      paddingTop: 2,
      minWidth: 150,
      borderRadius: 5,
      zIndex: 10,
      shadowColor: colors.colorBlack,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    dropdownItemWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingVertical: 10,
      gap: 8,
      borderBottomColor: colors.colorPrimary,
      borderBottomWidth: 1,
      width: '100%',
    },
    dropdownItem: {
      color: colors.colorPrimary,
      fontWeight: '500'
    },
    backdrop: {
      position: "absolute",
      // Dimensões gigantes para garantir cobertura total fora do dropdown
      width: screenWidth * 2,
      height: screenHeight * 2,
      left: -screenWidth,
      top: -screenHeight,
      backgroundColor: "transparent",
    }
  });
}
