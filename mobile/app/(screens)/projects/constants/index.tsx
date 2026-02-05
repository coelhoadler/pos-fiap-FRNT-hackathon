import { baseColors } from "@/app/constants/theme";
import { IDropdownItem } from "@/app/interface/dropdown";
import { ILegendContentItem } from "@/app/interface/modal";
import { EllipsisVertical, Eye, Pencil, Trash } from "lucide-react-native";

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
export const legendContentItems: ILegendContentItem[] = [
  {
    description: "Visualizar o projeto e suas tarefas",
    icon: <Eye size={20} color={baseColors.text} />,
  },
  {
    description: "Excluir o projeto e todas as suas tarefas.",
    icon: <Trash size={20} color={baseColors.text} />,
    styleLegendIcon: { marginTop: 5 },
  },
  {
    description: "Editar nome e configurações básicas do projeto.",
    icon: <Pencil size={19} color={baseColors.text} />,
    styleLegendIcon: { marginTop: 5 },
  },
  {
    description: "Visualizar mais opções de configuração do projeto.",
    icon: <EllipsisVertical size={24} color={baseColors.text} />,
    styleLegendIcon: { marginTop: 3 },
  },
];
