import { StyleProp, ViewStyle } from "react-native";

export interface IListItemProject {
  id: string;
  nameProject: string;
  dropdownActions?: React.ReactElement;
  onPressEdit: () => void;
  onPressMoreOptions: () => void;
  onPressDelete: () => void;
  onPressView: () => void;
  openDropdownActions?: boolean;
}

export interface IProjectListNotFound {
  text: string;
  message: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}
