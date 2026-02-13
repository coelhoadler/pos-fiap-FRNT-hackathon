import { ViewStyle } from "react-native";

export interface IAccordion {
    title: string;
    children: React.ReactNode;
    style?: ViewStyle;
    headerStyle?: ViewStyle;
    initialMode?: boolean; 
}