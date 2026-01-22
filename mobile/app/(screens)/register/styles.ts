import { Colors } from "@/app/constants/theme";
import { StyleSheet } from "react-native";

export function styles(colorScheme: 'light' | 'dark' = 'dark') {

    const colors = Colors[colorScheme];

    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background,
            color: colors.text,
        },
    });
}