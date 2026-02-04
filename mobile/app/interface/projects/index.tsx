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
