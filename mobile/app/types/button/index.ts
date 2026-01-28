import { StyleProp, TextStyle, ViewStyle } from "react-native";

export type ButtonVariant = "primary" | "secondary" | "outline" | "close";
export type TButton = {
    title: string;
    onPress?: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    size?:number;
    colorIcon?: string;
}