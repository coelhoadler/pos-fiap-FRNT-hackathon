import { Colors } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export function styles(colorScheme: 'light' | 'dark' = 'dark') {
    const { width, height } = Dimensions.get('window');
    const colors = Colors[colorScheme];

    return StyleSheet.create({
        wrapperContent: {
            paddingTop:20,
            backgroundColor: colors.background,
        },
    });
}