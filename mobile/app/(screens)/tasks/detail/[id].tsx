import { ActionsButtonsProjects } from "@/app/components/projects/actionsButton";
import { ModalLegendTasks } from "@/app/components/tasks/modalLegend";
import { useTaskTimer } from "@/app/components/tasks/taskTimer/task-timer-context";
import { ThemedView } from "@/app/components/themed-view";
import { Button } from "@/app/components/ui/button";
import { Modal } from "@/app/components/ui/modal";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { ITaskService } from "@/app/interface/tasks";
import { eventBus, PREFERENCES_UPDATED } from "@/app/services/eventBus";
import { getPreferences } from "@/app/services/preferences";
import { getProjectById } from "@/app/services/projects";
import { deleteTask, getTaskById } from "@/app/services/tasks";
import { genericFormStyles } from "@/app/styles/genericFormStyles";
import { genericStyle } from "@/app/styles/genericStyles";
import { useFocusEffect } from "@react-navigation/native";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Columns,
  Pencil,
  Play,
  Trash2,
  User,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { legendContentItems } from "../constants";
import { createStyles } from "./styles";

export default function TaskDetail() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];
  const router = useRouter();

  const params = useLocalSearchParams<{ id: string; projectId: string }>();

  const [task, setTask] = useState<ITaskService | null>(null);
  const [columnName, setColumnName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);
  const { startTimer, resumeTimer, isRunning, timeLeftSeconds } =
    useTaskTimer();
  const [openModalLegend, setOpenModalLegend] = useState(false);

  const fetchTaskData = async () => {
    try {
      setLoading(true);
      if (params.projectId && params.id) {
        const taskData = await getTaskById(params.projectId, params.id);
        setTask(taskData);

        if (taskData?.columnId) {
          const projectData = await getProjectById(params.projectId);
          const currentColumn = projectData?.columns?.find(
            (col: any) => col.id === taskData.columnId,
          );
          if (currentColumn) {
            setColumnName(currentColumn.name);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados do detalhe:", error);
    } finally {
      setLoading(false);
    }
  };

  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [summaryModeEnabled, setSummaryModeEnabled] = useState(false);

  const loadPreferences = () => {
    getPreferences().then((prefs) => {
      setSummaryModeEnabled(!!prefs?.summaryMode);
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchTaskData();
      setOpenModalLegend(false);
      loadPreferences();

      const unsubscribe = eventBus.on(PREFERENCES_UPDATED, loadPreferences);
      return () => {
        unsubscribe();
        setShowMoreInfo(false);
      };
    }, [params.id, params.projectId]),
  );

  const otherInfos = [
    { label: "Status", value: task?.status, icon: Activity },
    {
      label: "Prioridade",
      value: task?.priority,
      icon: AlertCircle,
    },
    {
      label: "Coluna atual",
      value: columnName,
      icon: Columns,
    },
    {
      label: "Tempo estimado",
      value: task?.tempoExecucao,
      icon: Clock,
    },
    {
      label: "Prazo de entrega",
      value: task?.dataFinalizar,
      icon: Calendar,
    },

    { label: "Responsável", value: task?.author, icon: User },
  ];

  const handleEdit = () => {
    router.push({
      pathname: "/(screens)/home/(tabs)/tasks/editTask/[id]",
      params: {
        id: params.id,
        projectId: params.projectId,
        ...task,
        columnName: columnName,
      },
    });
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    setIsDeleting(true);
    try {
      await deleteTask(params.projectId, params.id);
      setSuccessDelete(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && !task) {
    return (
      <ThemedView
        style={[
          genericStyle(colorScheme).container,
          { justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.colorPrimary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      <Tabs.Screen
        options={{
          headerTitle: "Detalhe da Tarefa",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 15 }}
            >
              <ArrowLeft color={colors.text} size={24} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <ActionsButtonsProjects
              onlyInformationButton
              openModal={() => setOpenModalLegend(true)}
            />
          ),
        }}
      />

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>{task?.nome || "Tarefa"}</Text>
        <View style={styles.actionsWrapper}>
          {!isRunning && (
            <Pressable
              onPress={() =>
                timeLeftSeconds === 0
                  ? startTimer({
                    id: task?.id,
                    nome: task?.nome,
                    tempoExecucao: task?.tempoExecucao,
                  })
                  : resumeTimer()
              }
            >
              <Play size={22} color={colors.colorPrimary} />
            </Pressable>
          )}
          <Pressable onPress={() => setShowDeleteModal(true)}>
            <Trash2 size={22} color={colors.colorPrimary} />
          </Pressable>
          <Pressable onPress={handleEdit}>
            <Pencil size={22} color={colors.colorPrimary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapperDetail}>
          <View>
            <View style={styles.wrapperDescripionTitle}>
              <Text
                style={[
                  genericFormStyles(colorScheme).defaultLabel,
                  styles.subtitle,
                ]}
              >
                Descrição
              </Text>
            </View>
            <View style={styles.wrapperDescripionContent}>
              <Text style={styles.descriptionText}>
                {task?.descricao || "Nenhuma descrição fornecida."}
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: colors.colorPrimary,
              marginVertical: 15,
            }}
          />

          {summaryModeEnabled && !showMoreInfo ? (
            <Button
              title="Visualizar mais informações"
              onPress={() => setShowMoreInfo(true)}
              variant="outline"
              style={{ marginTop: 10 }}
            />
          ) : (
            <View style={styles.othersInfosWrapper}>
              {otherInfos.map((item, index) => (
                <React.Fragment key={index}>
                  {item.value ? (
                    <View style={styles.otherInfosItems}>
                      <View style={styles.otherInfosicon}>
                        <item.icon size={20} color={colors.colorPrimary} />
                      </View>
                      <View style={{ width: "100%" }}>
                        <Text style={styles.otherInfosLabel}>{item.label}</Text>
                        <Text style={styles.otherInfosTitle}>{item.value}</Text>
                      </View>
                    </View>
                  ) : null}
                </React.Fragment>
              ))}

              {summaryModeEnabled && (
                <Button
                  title="Ocultar informações"
                  onPress={() => setShowMoreInfo(false)}
                  variant="outline"
                  style={{ marginTop: 20 }}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {openModalLegend && (
        <ModalLegendTasks
          legendContentItems={legendContentItems}
          subtitleContentItem="Explicando um pouco sobre a página de edição de tarefa."
          open={openModalLegend}
          onClose={() => setOpenModalLegend(false)}
        />
      )}
      {showDeleteModal && (
        <Modal
          styleContainer={{ top: 20 }}
          contentType="withActions"
          text={`Deseja realmente excluir a tarefa "${task?.nome}"?`}
          onPressActionB={confirmDelete}
          onPressActionA={() => setShowDeleteModal(false)}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      {successDelete && (
        <Modal
          style={{ width: "100%" }}
          contentType="feedbackMessage"
          text="Tarefa excluída com sucesso!"
          onPress={() => {
            setSuccessDelete(false);
            router.back();
          }}
        />
      )}

      {isDeleting && (
        <Modal
          style={{ width: "100%" }}
          hasCloseButton={false}
          contentType="loading"
        />
      )}
    </ThemedView>
  );
}
