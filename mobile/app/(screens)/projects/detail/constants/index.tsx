import { baseColors } from "@/app/constants/theme";
import { ILegendContentItem } from "@/app/interface/modal";
import {
  Calendar,
  CirclePlus,
  EllipsisVertical,
  Eye,
  Pencil,
  Play,
  Settings,
  Trash,
} from "lucide-react-native";
import { Text } from "react-native";

export const columnOptions = [
  "Em andamento",
  "Pendencias",
  "Concluidas",
  "Outro",
];

export const detailProjectLegendContent: ILegendContentItem[] = [
  {
    icon: <Settings size={20} color={baseColors.text} />,
    description: "Configurações do projeto",
  },
  {
    description: "Visualizar mais opções de configuração das colunas.",
    icon: <EllipsisVertical size={24} color={baseColors.text} />,
    styleLegendIcon: { marginTop: 3 },
  },
  {
    icon: <Pencil size={19} color={baseColors.text} />,
    description: "Editar informações do projeto, colunas e tarefas.",
    styleLegendIcon: { marginTop: 5 },
  },
  {
    description: "Inciar tarefa com o modo foco(pomodoro).",
    icon: <Play size={20} color={baseColors.text} />,
    styleLegendIcon: { marginTop: 5 },
  },
  {
    description: "Visualizar todas as informações da tarefa.",
    icon: <Eye size={20} color={baseColors.text} />,
  },
  {
    description: "Excluir projeto, colunas e tarefas",
    icon: <Trash size={20} color={baseColors.text} />,
    styleLegendIcon: { marginTop: 5 },
  },
  {
    description: "Data para finalização da tarefa.",
    icon: <Calendar size={20} color={baseColors.text} />,
  },
  {
    icon: <CirclePlus size={20} color={baseColors.text} />,
    description: (
      <>
        &quot;Adicione uma nova coluna&quot;:
        <Text style={{ fontWeight: "bold" }}>
          adicione uma nova coluna ao projeto.
        </Text>
      </>
    ),
    styleLegendIcon: { marginTop: 2 },
  },
  {
    icon: <CirclePlus size={20} color={baseColors.text} />,
    description: (
      <>
        &quot;Nova tarefa:&quot;
        <Text style={{ fontWeight: "bold" }}>
          adicione uma nova tarefa ao projeto.
        </Text>
      </>
    ),
    styleLegendIcon: { marginTop: 2 },
  },
];
