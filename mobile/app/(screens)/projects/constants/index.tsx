import { baseColors } from "@/app/constants/theme";
import { IDropdownItem } from "@/app/interface/dropdown";
import { Pencil } from "lucide-react-native";

export const dropdownItemsProjects: IDropdownItem[] = [
  {
    id: "1",
    name: "Share Project",
    onPress: () => {},
    icon: <Pencil size={18} color={baseColors.colorPrimary} />,
  },
  {
    id: "2",
    name: "Share Project",
    onPress: () => {},
    icon: <Pencil size={18} color={baseColors.colorPrimary} />,
  },
  {
    id: "3",
    name: "Share Project",
    onPress: () => {},
    icon: <Pencil size={18} color={baseColors.colorPrimary} />,
  },
];
