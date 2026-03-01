import { baseColors } from "@/app/constants/theme";
import { ILegendContentItem } from "@/app/interface/modal";
import {
  Pencil,
  Play,
  Trash
} from "lucide-react-native";

export const legendContentItems: ILegendContentItem[] = [
  {
    description: "Excluir a tarefa.",
    icon: <Trash size={20} color={baseColors.text} />,
    styleLegendIcon: { marginTop: 5 },
  },
  {
    description: "Editar informações da tarefa.",
    icon: <Pencil size={19} color={baseColors.text} />,
    styleLegendIcon: { marginTop: 5 },
  },
  {
    description: "Inciar tarefa com o modo foco(pomodoro).",
    icon: <Play size={20} color={baseColors.text} />,
    styleLegendIcon: { marginTop: 5 },
  },
];

export const addTaskLegendContent: ILegendContentItem[] = [
  {
    description: "Essa página é para ser criada a sua tarefa.",
  },
  {
    description: "Campos com o '*' são obrigatórios.",
  },
  {
    description:
      "Item 'status' define se a tarefa está iniciada, em andamento, concluída ou atrasada.",
  },
  {
    description: "Item 'prioridade' define o nível de importância da tarefa.",
  },
  {
    description:
      "Item 'coluna destino' define a coluna onde a tarefa será criada.",
  },
  {
    description:
      "Item 'data finalizar' define a data limite para conclusão da tarefa.",
  },
];
export const editTaskLegendContent: ILegendContentItem[] = [
  {
    description: "Essa página é para atualizar as informações da sua tarefa.",
  },
  {
    description: "Campos com o '*' são obrigatórios.",
  },
  {
    description:
      "Item 'status' define se a tarefa está iniciada, em andamento, concluída ou atrasada.",
  },
  {
    description: "Item 'prioridade' define o nível de importância da tarefa.",
  },
  {
    description:
      "Item 'coluna destino' define a coluna onde a tarefa será criada.",
  },
  {
    description:
      "Item 'data finalizar' define a data limite para conclusão da tarefa.",
  },
];
