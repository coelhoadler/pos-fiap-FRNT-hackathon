import { StyleProp, ViewStyle } from "react-native";

export interface ICardHome {
  title: string;
  description?: string;
  textButton?: string;
  onPressView?: () => void;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>; 
}