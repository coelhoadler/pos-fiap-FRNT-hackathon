import { StyleProp, ViewStyle } from "react-native";

export interface IModal {
    children?: React.ReactNode;
    text?: string;
    onClose?: () => void;
    open?: boolean;
    style?: StyleProp<ViewStyle>;
}