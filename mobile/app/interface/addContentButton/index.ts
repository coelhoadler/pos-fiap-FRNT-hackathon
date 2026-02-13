import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface IAddContentButton {
  text?: string;
  children?: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  styleText?: StyleProp<TextStyle>;
  size?:number;
}