import { StyleProp, ViewStyle } from "react-native";

export interface IDropdownContent{
    style?: StyleProp<ViewStyle>;
    dropdownItems?: IDropdownItem[];
    onClose?: () => void;
}
export interface IDropdownItem{
    id: string;
    name: string;
    onPress: () => void;
    icon: React.ReactElement;
}