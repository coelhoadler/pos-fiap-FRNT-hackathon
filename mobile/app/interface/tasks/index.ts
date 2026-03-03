import { StyleProp, ViewStyle } from "react-native";

export type TaskPriority = "baixa" | "media" | "alta" | "urgente";
export type TaskStatus = "não iniciada" | "em andamento" | "concluída" | "atrasada";
export interface ITaskService {
  id: string;
  nome: string;
  descricao: string;
  tempoExecucao: string;
  dataFinalizar: string;
  status: TaskStatus;
  priority: TaskPriority;
  columnId: string;
  projectId: string;
  author: string;
  createdAt: any;
  updatedAt: any;
}

export interface ISummaryCard {
  style?: StyleProp<ViewStyle>;
  styleHeader?: StyleProp<ViewStyle>;
  title: string;
  description: string;
  colorIcon?: string;
  sizeIcon?: number;
  time?: string;
  author: string;
  date: string;
  onPressView?: () => void;
  onPressDelete?: () => void;
  onPressEdit?: () => void;
  onPressPlay?: () => void;
  onPressPomodoro?: () => void;
  summaryMode?: boolean;
}

export interface ITasksListNotFound {
  message: string;
  style?: StyleProp<ViewStyle>;
}