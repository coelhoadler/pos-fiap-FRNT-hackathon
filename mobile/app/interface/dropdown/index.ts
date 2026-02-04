import { StyleProp, ViewStyle } from "react-native";

export interface IDropdownContent{
    style?: StyleProp<ViewStyle>;
    dropdownItems?: IDropdownItem[];
}
export interface IDropdownItem{
    id: string;
    name: string;
    onPress: () => void;
    icon: React.ReactElement;
}