import { StyleProp, TextInputProps, ViewStyle } from "react-native";
import { StyleProps } from "react-native-reanimated";

export interface IInput extends Omit<TextInputProps, 'style'> {
  text?: string | React.ReactNode;      
  id?: string;        
  value?: string;    
  style?: StyleProp<ViewStyle>; 
  styleInput?: StyleProp<StyleProps>; 
  type?: "text" | "password" | "email" | "numeric";
}