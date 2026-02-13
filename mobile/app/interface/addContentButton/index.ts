import { StyleProp, ViewStyle } from "react-native";

export interface IAddContentButton {
  text?: string;
  children?: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}