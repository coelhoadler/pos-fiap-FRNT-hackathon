import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface IFormErrorMessage {
    message: string | React.ReactNode;
    style?: StyleProp<ViewStyle>;
    styleText?: TextStyle;
}