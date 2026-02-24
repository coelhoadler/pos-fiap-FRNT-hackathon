import { useFocusEffect } from "@react-navigation/native";
import { router, Tabs, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { SummaryCard } from "@/app/components/tasks/summaryCard";
import { TasksNotFound } from "@/app/components/tasks/tasksNotFound";
import { ThemedView } from "@/app/components/themed-view";
import { Modal } from "@/app/components/ui/modal";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { ITaskService } from "@/app/interface/tasks";
import { deleteTask, getTasksByColumn } from "@/app/services/tasks";
import { genericStyle } from "@/app/styles/genericStyles";
import { createStyles } from "./styles";

export default function ColumnTaskDetail() {
  const { id, projectId, columnName } = useLocalSearchParams<{
    id: string;
    projectId: string;
    columnName: string;
  }>();

  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  const [tasks, setTasks] = useState<ITaskService[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskToDelete, setTaskToDelete] = useState<ITaskService | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTasks = async () => {
    try {
      if (!projectId || !id) return;
      const data = await getTasksByColumn(projectId, id);
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [id]),
  );

  const handleViewTask = (task: ITaskService) => {
    router.push({
      pathname: "/(screens)/home/(tabs)/tasks/detail/[id]",
      params: {
        id: task.id,
        nome: task.nome,
        descricao: task.descricao,
        dataFinalizar: task.dataFinalizar,
        tempoExecucao: task.tempoExecucao,
        author: task.author || "Usuário",
        projectId: projectId,
        columnId: id,
      },
    });
  };

  const handleEditTask = (task: ITaskService) => {
    router.push({
      pathname: "/(screens)/home/(tabs)/tasks/editTask/[id]",
      params: {
        id: task.id,
        nome: task.nome,
        descricao: task.descricao,
        dataFinalizar: task.dataFinalizar,
        tempoExecucao: task.tempoExecucao,
        projectId: projectId,
        columnId: id,
      },
    });
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    setActionLoading(true);

    try {
      await deleteTask(projectId!, taskToDelete.id);
      setSuccessMessage("Tarefa excluída com sucesso!");
      fetchTasks();
    } catch (error) {
      setErrorMessage("Erro ao excluir tarefa.");
    } finally {
      setActionLoading(false);
      setTaskToDelete(null);
    }
  };

  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      <Tabs.Screen
        options={{
          headerTitle: columnName || "Tarefas",
        }}
      />

      <Text style={styles.title}>{columnName}</Text>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size={30} color={colors.colorPrimary} />
        ) : tasks.length === 0 ? (
          <TasksNotFound message="Nenhuma tarefa encontrada" />
        ) : (
          <View style={{ gap: 15 }}>
            {tasks.map((task) => (
              <SummaryCard
                key={task.id}
                title={task.nome}
                description={task.descricao}
                author={task.author || "Usuário"}
                time={task.tempoExecucao}
                date={task.dataFinalizar}
                onPressView={() => handleViewTask(task)}
                onPressDelete={() => setTaskToDelete(task)}
                onPressEdit={() => handleEditTask(task)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {taskToDelete && (
        <Modal
          contentType="withActions"
          text={`Deseja realmente excluir a tarefa "${taskToDelete.nome}"?`}
          onPressActionB={handleDeleteTask}
          onPressActionA={() => setTaskToDelete(null)}
          onClose={() => setTaskToDelete(null)}
        />
      )}

      {actionLoading && <Modal contentType="loading" hasCloseButton={false} />}

      {successMessage !== "" && (
        <Modal
          contentType="feedbackMessage"
          text={successMessage}
          onPress={() => setSuccessMessage("")}
          hasCloseButton={false}
        />
      )}

      {errorMessage !== "" && (
        <Modal
          contentType="feedbackMessage"
          text={errorMessage}
          onClose={() => setErrorMessage("")}
          onPress={() => setErrorMessage("")}
        />
      )}
    </ThemedView>
  );
}
