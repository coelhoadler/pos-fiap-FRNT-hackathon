import { StyleProp, TextInputProps, ViewStyle } from "react-native";

export interface IInput extends Omit<TextInputProps, 'style'> {
  text?: string | React.ReactNode;      
  id: string;        
  value?: string;    
  style?: StyleProp<ViewStyle>; 
  type?: "text" | "password" | "email" | "numeric";
}