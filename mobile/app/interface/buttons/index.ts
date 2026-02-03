import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface ButtonVariant {
  value: "primary" | "secondary" | "outline" | "close";
}

export interface IButton  {
    title?: string;
    onPress?: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    size?:number;
    colorIcon?: string;
}

export interface IIconButton extends IButton {
    icon: React.ReactElement;
}