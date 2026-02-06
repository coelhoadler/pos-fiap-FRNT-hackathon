import { baseColors } from "@/app/constants/theme";
import { IDropdownItem } from "@/app/interface/dropdown";
import { ILegendContentItem } from "@/app/interface/modal";
import {
  CirclePlus,
  EllipsisVertical,
  Eye,
  Pencil,
  Play,
  Settings,
  Trash,
} from "lucide-react-native";

export const dropdownItemsProjects: IDropdownItem[] = [
  {
    id: "1",
    name: "Iniciar tarefa",
    onPress: () => {},
    icon: <Play size={16} color={baseColors.colorPrimary} />,
  },
  {
    id: "2",
    name: "Nova tarefa",
    onPress: () => {},
    icon: <CirclePlus size={17} color={baseColors.colorPrimary} />,
  },
  {
    id: "3",
    name: "Configurações",
    onPress: () => {},
    icon: <Settings size={16} color={baseColors.colorPrimary} />,
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
export const addProjectLegendContent: ILegendContentItem[] = [
  {
    description:
      "Essa página é para ser criado o seu projeto e vincular tarefas a ele.",
  },
];
