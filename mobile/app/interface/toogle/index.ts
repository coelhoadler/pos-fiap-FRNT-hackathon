import { ViewStyle } from "react-native";

export interface IToggleItem{
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  id:string;
}