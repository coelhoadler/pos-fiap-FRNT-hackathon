import { ViewStyle } from "react-native";

export interface IToggleItemProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  id:string;
}