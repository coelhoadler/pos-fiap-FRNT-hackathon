import { StyleProp, TextInputProps, ViewStyle } from "react-native";

export interface ITextArea extends Omit<TextInputProps, 'style'> {
  text: string;
  id?: string;
  value?: string;
  style?: StyleProp<ViewStyle>;
  numberOfLines?: number; 
}