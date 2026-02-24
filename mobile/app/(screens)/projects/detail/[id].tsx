import { useFocusEffect } from "@react-navigation/native";
import { router, Tabs, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ActionsButtonsProjects } from "@/app/components/projects/actionsButton";
import { ModalLegendProjects } from "@/app/components/projects/modalLegend";
import { SummaryCard } from "@/app/components/tasks/summaryCard";
import { TasksNotFound } from "@/app/components/tasks/tasksNotFound";
import { ThemedView } from "@/app/components/themed-view";
import { Accordion } from "@/app/components/ui/accordion";
import { AddContentButton } from "@/app/components/ui/addContentButton";
import { Button } from "@/app/components/ui/button";
import { DropdownContent } from "@/app/components/ui/dropdown/dropdownContent";
import { FormErrorMessage } from "@/app/components/ui/errorMessages/forms";
import { Input } from "@/app/components/ui/input";
import { Modal } from "@/app/components/ui/modal";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import {
  IProjectService,
  IProjectServiceColumn,
} from "@/app/interface/project";
import { ITaskService } from "@/app/interface/tasks";
import {
  addColumnToProject,
  deleteColumnFromProject,
  deleteProject,
  getProjectById,
  updateColumnInProject,
} from "@/app/services/projects";
import {
  deleteTask,
  deleteTasksByColumn,
  getLimitedTasksByColumn,
} from "@/app/services/tasks";
import { genericStyle } from "@/app/styles/genericStyles";
import {
  CheckSquare,
  EllipsisVertical,
  FileChartColumn,
  Pencil,
  Square,
  Trash2,
} from "lucide-react-native";
import { columnOptions, detailProjectLegendContent } from "./constants";
import { createStyles } from "./styles";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  const [project, setProject] = useState<IProjectService | null>(null);
  const [tasksByColumn, setTasksByColumn] = useState<{
    [key: string]: ITaskService[];
  }>({});

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [textLoading, setTextLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const [showDropdownSetting, setShowDropdownSetting] = useState(false);
  const [activeDropdownColumnId, setActiveDropdownColumnId] = useState<
    string | null
  >(null);
  const [openModalDeleteProject, setOpenModalDeleteProject] = useState(false);

  const [openModalAddColumn, setOpenModalAddColumn] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [error, setError] = useState("");
  const [openModalConfirmAddMultiple, setOpenModalConfirmAddMultiple] =
    useState(false);
  const [openModalLegend, setOpenModalLegend] = useState(false);

  const [columnsWithConflict, setColumnsWithConflict] = useState<string[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  const [columnToEdit, setColumnToEdit] =
    useState<IProjectServiceColumn | null>(null);
  const [editColumnName, setEditColumnName] = useState("");
  const [editError, setEditError] = useState("");
  const [columnToDelete, setColumnToDelete] =
    useState<IProjectServiceColumn | null>(null);

  const [taskToDelete, setTaskToDelete] = useState<ITaskService | null>(null);

  const projectColumns = useMemo(
    () => project?.columns || [],
    [project?.columns],
  );

  const fetchTasksForColumns = async (columns: IProjectServiceColumn[]) => {
    try {
      const tasksMap: { [key: string]: ITaskService[] } = {};

      const promises = columns.map(async (col) => {
        const tasks = await getLimitedTasksByColumn(id!, col.id, 3);
        tasksMap[col.id] = tasks;
      });

      await Promise.all(promises);
      setTasksByColumn(tasksMap);
    } catch (error) {
      console.error("Erro ao buscar tarefas das colunas:", error);
    }
  };

  const fetchProjectDetail = async () => {
    try {
      if (id) {
        const data = await getProjectById(id);
        setProject(data);

        if (data?.columns && data.columns.length > 0) {
          await fetchTasksForColumns(data.columns);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProjectDetail();
      setOpenModalLegend(false);

      return () => {
        setActiveDropdownColumnId(null);
        setShowDropdownSetting(false);
      };
    }, [id]),
  );

  const handleCloseSuccess = () => {
    const isProjectDeleted = successMessage === "Projeto excluído com sucesso!";
    setSuccessMessage("");
    setLoadingFeedback(true);
    setTimeout(() => {
      setLoadingFeedback(false);
      if (isProjectDeleted) {
        router.replace("/(screens)/home/(tabs)/projects/projects");
      }
    }, 500);
  };

  const toggleOption = (option: string) => {
    setError("");
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
  };

  const getUniqueColumnName = (
    name: string,
    currentColumns: IProjectServiceColumn[],
  ) => {
    const existingNames = currentColumns.map((c) => c.name.toLowerCase());
    if (!existingNames.includes(name.toLowerCase())) return name;

    let counter = 1;
    let newName = `${name} ${counter}`;
    while (
      currentColumns.some((c) => c.name.toLowerCase() === newName.toLowerCase())
    ) {
      counter++;
      newName = `${name} ${counter}`;
    }
    return newName;
  };

  const handleAddColumn = async (forceCreate = false) => {
    if (selectedOptions.length === 0) {
      setError("Por favor, selecione ao menos uma opção.");
      return;
    }

    if (selectedOptions.includes("Outro") && !newColumnName.trim()) {
      setError("Por favor, digite o nome para a coluna personalizada.");
      return;
    }

    const namesToAdd = selectedOptions.map((opt) =>
      opt === "Outro" ? newColumnName : opt,
    );
    const conflicts = namesToAdd.filter((name) =>
      projectColumns.some(
        (col) => col.name.toLowerCase() === name.toLowerCase(),
      ),
    );

    if (conflicts.length > 0 && !forceCreate) {
      setColumnsWithConflict(conflicts);
      setShowDuplicateWarning(true);
      return;
    }

    if (
      selectedOptions.length > 1 &&
      !openModalConfirmAddMultiple &&
      !forceCreate
    ) {
      setOpenModalConfirmAddMultiple(true);
      return;
    }

    setOpenModalAddColumn(false);
    setOpenModalConfirmAddMultiple(false);
    setShowDuplicateWarning(false);
    setTextLoading(
      selectedOptions.length > 1 ? "Criando colunas..." : "Criando coluna...",
    );
    setActionLoading(true);

    try {
      let tempColumns: IProjectServiceColumn[] = [...projectColumns];
      for (const option of selectedOptions) {
        const baseName = option === "Outro" ? newColumnName : option;
        const finalName = getUniqueColumnName(baseName, tempColumns);
        await addColumnToProject(id!, finalName);
        tempColumns.push({ id: Math.random().toString(), name: finalName });
      }
      setSuccessMessage("Colunas adicionadas com sucesso!");
      setNewColumnName("");
      setSelectedOptions([]);
      fetchProjectDetail();
    } catch (error) {
      setErrorMessage("Erro ao criar colunas.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateColumnName = async () => {
    if (!editColumnName.trim() || !columnToEdit) return;

    const nameExists = projectColumns.some(
      (col) =>
        col.id !== columnToEdit.id &&
        col.name.toLowerCase() === editColumnName.trim().toLowerCase(),
    );

    if (nameExists) {
      setEditError("Já existe uma coluna com este nome.");
      return;
    }

    setColumnToEdit(null);
    setTextLoading("Atualizando coluna...");
    setActionLoading(true);

    try {
      const updatedColumns = projectColumns.map((col) =>
        col.id === columnToEdit.id
          ? { ...col, name: editColumnName.trim() }
          : col,
      );
      await updateColumnInProject(id!, updatedColumns);
      setSuccessMessage("Coluna atualizada com sucesso!");
      fetchProjectDetail();
    } catch (error) {
      setErrorMessage("Erro ao atualizar coluna.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteColumn = async () => {
    if (!columnToDelete) return;
    const colToDelete = columnToDelete;
    setColumnToDelete(null);
    setTextLoading("Excluindo coluna e tarefas...");
    setActionLoading(true);

    try {
      await deleteTasksByColumn(id!, colToDelete.id);
      await deleteColumnFromProject(id!, colToDelete);

      setSuccessMessage("Coluna e tarefas excluídas com sucesso!");
      fetchProjectDetail();
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao excluir coluna.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!id) return;
    setOpenModalDeleteProject(false);
    setTextLoading("Excluindo projeto...");
    setActionLoading(true);

    try {
      await deleteProject(id);
      setSuccessMessage("Projeto excluído com sucesso!");
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao excluir projeto.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    const taskId = taskToDelete.id;
    setTaskToDelete(null);
    setTextLoading("Excluindo tarefa...");
    setActionLoading(true);

    try {
      await deleteTask(id!, taskId);
      setSuccessMessage("Tarefa excluída com sucesso!");
      fetchProjectDetail();
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao excluir a tarefa.");
    } finally {
      setActionLoading(false);
    }
  };

  const dropdownItemsProjectSetting = [
    {
      id: "proj-edit",
      name: "Editar Projeto",
      onPress: () => {
        setShowDropdownSetting(false);
        router.push({
          pathname: "/(screens)/home/(tabs)/projects/editProject/[id]",
          params: {
            id: project?.id!,
            name: project?.name,
            description: project?.description,
          },
        });
      },
      icon: <Pencil size={20} color={colors.colorPrimary} />,
    },
    {
      id: "proj-delete",
      name: "Excluir Projeto",
      onPress: () => {
        setShowDropdownSetting(false);
        setOpenModalDeleteProject(true);
      },
      icon: <Trash2 size={20} color={colors.colorPrimary} />,
    },
  ];

  const navigationToNewTask = (column: IProjectServiceColumn) => {
    router.push({
      pathname: "/(screens)/home/(tabs)/tasks/addTask",
      params: {
        projectId: id,
        columnId: column.id,
        columnName: column.name,
      },
    });
  };

  const handleEditTask = (task: ITaskService, columnId: string) => {
    router.push({
      pathname: "/(screens)/home/(tabs)/tasks/editTask/[id]",
      params: {
        id: task.id,
        nome: task.nome,
        descricao: task.descricao,
        dataFinalizar: task.dataFinalizar,
        tempoExecucao: task.tempoExecucao,
        projectId: id,
        columnId: columnId,
      },
    });
  };

  const handleViewAllTasks = (column: IProjectServiceColumn) => {
    router.push({
      pathname: "/(screens)/home/(tabs)/tasks/column/[id]",
      params: {
        id: column.id,
        columnName: column.name,
        projectId: id,
      },
    });
  };

  const handleViewTask = (task: ITaskService, columnId: string) => {
    router.push({
      pathname: "/(screens)/home/(tabs)/tasks/detail/[id]",
      params: {
        id: task.id,
        nome: task.nome,
        descricao: task.descricao,
        dataFinalizar: task.dataFinalizar,
        tempoExecucao: task.tempoExecucao,
        author: task.author || "Usuário",
        projectId: id,
        columnId: columnId,
      },
    });
  };

  const getDropdownColumnsSetting = (column: IProjectServiceColumn) => [
    {
      id: `edit-${column.id}`,
      name: "Editar Coluna",
      onPress: () => {
        setActiveDropdownColumnId(null);
        setEditError("");
        setColumnToEdit(column);
        setEditColumnName(column.name);
      },
      icon: <Pencil size={20} color={colors.text} />,
    },
    {
      id: `del-${column.id}`,
      name: "Excluir Coluna",
      onPress: () => {
        setActiveDropdownColumnId(null);
        setColumnToDelete(column);
      },
      icon: <Trash2 size={20} color={colors.text} />,
    },
  ];

  return (
    <ThemedView
      style={[genericStyle(colorScheme).container, styles.detailProject]}
    >
      <Tabs.Screen
        options={{
          headerTitle: project?.name || "Projeto",
          headerRight: () => (
            <View style={{ marginRight: 15 }}>
              <ActionsButtonsProjects
                hasSettingItem
                onPressSetting={() =>
                  setShowDropdownSetting(!showDropdownSetting)
                }
                openModal={() => setOpenModalLegend(true)}
              />
              {showDropdownSetting && (
                <DropdownContent
                  style={{ right: 0 }}
                  onClose={() => setShowDropdownSetting(false)}
                  dropdownItems={dropdownItemsProjectSetting}
                />
              )}
            </View>
          ),
        }}
      />

      {project?.name && <Text style={styles.title}>{project.name}</Text>}
      {project?.description && (
        <Text style={styles.description}>{project.description}</Text>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      >
        {loading ? (
          <View style={styles.wrapperMessageNoColumn}>
            <View style={styles.itemMessageNoColumn}>
              <ActivityIndicator size={35} color={colors.colorPrimary} />
              <Text style={styles.noColumnTitle}>Carregando colunas...</Text>
            </View>
          </View>
        ) : projectColumns.length === 0 ? (
          <View style={styles.wrapperMessageNoColumn}>
            <View style={styles.itemMessageNoColumn}>
              <FileChartColumn size={35} color={colors.colorPrimary} />
              <Text style={styles.noColumnTitle}>Nenhuma coluna ainda</Text>
            </View>
            <AddContentButton
              onPress={() => {
                setSelectedOptions([]);
                setNewColumnName("");
                setError("");
                setOpenModalAddColumn(true);
              }}
              text="Criar coluna"
            />
          </View>
        ) : (
          <View style={styles.containerColumn}>
            {projectColumns.map((column) => (
              <View key={column.id} style={styles.wrapperColumn}>
                <View style={{ flex: 1 }}>
                  <Accordion initialMode={true} title={column.name}>
                    <View style={{ gap: 10 }}>
                      {tasksByColumn[column.id] &&
                      tasksByColumn[column.id].length > 0 ? (
                        tasksByColumn[column.id].map((task) => (
                          <SummaryCard
                            key={task.id}
                            title={task.nome}
                            description={task.descricao}
                            author={task.author || "Usuário"}
                            time={task.tempoExecucao}
                            date={task.dataFinalizar}
                            onPressView={() => handleViewTask(task, column.id)}
                            onPressDelete={() => setTaskToDelete(task)}
                            onPressEdit={() => {
                              handleEditTask(task, column.id);
                            }}
                          />
                        ))
                      ) : (
                        <>
                          <TasksNotFound message="Nenhuma tarefa encontrada" />
                        </>
                      )}
                    </View>

                    {tasksByColumn[column.id] && (
                      <View
                        style={{
                          marginVertical: 15,
                          display: "flex",
                          gap: 15,
                        }}
                      >
                        <AddContentButton
                          onPress={() => navigationToNewTask(column)}
                          text="Nova tarefa"
                          styleText={{ color: colors.text, fontSize: 16 }}
                          colorIcon={colors.text}
                          size={22}
                          style={styles.addTaskButton}
                        />
                        {tasksByColumn[column.id].length >= 3 && (
                          <AddContentButton
                            noIcon
                            onPress={() => handleViewAllTasks(column)}
                            text="Ver todas as tarefas"
                            styleText={{ color: colors.text, fontSize: 16 }}
                            colorIcon={colors.text}
                            size={22}
                            style={styles.seeMoreTaskButton}
                          />
                        )}
                      </View>
                    )}
                  </Accordion>
                </View>
                <View style={{ position: "relative" }}>
                  <Pressable
                    onPress={() =>
                      setActiveDropdownColumnId(
                        activeDropdownColumnId === column.id ? null : column.id,
                      )
                    }
                  >
                    <View style={styles.actionsColumn}>
                      <EllipsisVertical color={colors.colorPrimary} />
                    </View>
                  </Pressable>
                  {activeDropdownColumnId === column.id && (
                    <DropdownContent
                      style={{ right: 1, top: 61 }}
                      onClose={() => setActiveDropdownColumnId(null)}
                      dropdownItems={getDropdownColumnsSetting(column)}
                    />
                  )}
                </View>
              </View>
            ))}
            <View style={{ marginTop: 15 }}>
              <AddContentButton
                onPress={() => {
                  setSelectedOptions([]);
                  setNewColumnName("");
                  setError("");
                  setOpenModalAddColumn(true);
                }}
                text="Adicione uma nova coluna"
                style={{ width: "85%", marginHorizontal: "auto" }}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* MODAIS (Mantenha o restante do seu código de modais exatamente como está) */}
      {/* ... (Omitido apenas para brevidade, mas deve permanecer no seu arquivo) ... */}

      {openModalAddColumn && (
        <Modal
          style={{ width: "100%" }}
          onClose={() => setOpenModalAddColumn(false)}
          contentType="customModal"
        >
          <Text style={styles.textModalColumn}>
            Escolha uma ou mais colunas
          </Text>
          <View style={[styles.optionsModalAddColumn]}>
            {columnOptions.map((option) => {
              const isSelected = selectedOptions.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => toggleOption(option)}
                  style={[
                    styles.itemModalAddColumn,
                    isSelected ? styles.isSelectedItemModalAddColumn : {},
                  ]}
                >
                  <Text
                    style={[
                      styles.textItemModalAddColumn,
                      { fontWeight: isSelected ? "600" : "400" },
                    ]}
                  >
                    {option}
                  </Text>
                  {isSelected ? (
                    <CheckSquare size={20} color={colors.colorPrimary} />
                  ) : (
                    <Square size={20} color={colors.colorPrimary} />
                  )}
                </TouchableOpacity>
              );
            })}
            {selectedOptions.includes("Outro") && (
              <>
                <Text style={styles.textModalColumnDescription}>
                  Crie o nome para a sua coluna no campo abaixo:
                </Text>
                <Input
                  style={{ gap: 0, marginTop: -10, marginBottom: -5 }}
                  styleInput={{
                    shadowColor: colors.colorPrimary,
                    borderColor: colors.colorPrimary,
                    borderWidth: 0.8,
                  }}
                  placeholder="Digite o nome personalizado"
                  value={newColumnName}
                  onChangeText={(t) => {
                    setNewColumnName(t);
                    setError("");
                  }}
                />
              </>
            )}
          </View>
          {error ? (
            <View style={styles.errorWrapper}>
              <FormErrorMessage
                style={{ paddingHorizontal: 3 }}
                message={error}
              />
            </View>
          ) : null}
          <Button
            title={
              selectedOptions.length > 1
                ? `Criar ${selectedOptions.length} colunas`
                : "Criar Coluna"
            }
            onPress={() => handleAddColumn(false)}
          />
        </Modal>
      )}

      {showDuplicateWarning && (
        <Modal
          onClose={() => setShowDuplicateWarning(false)}
          contentType="withActions"
          text={`As colunas (${columnsWithConflict.join(", ")}) já existem. Deseja criar mesmo assim?`}
          onPressActionB={() => handleAddColumn(true)}
          onPressActionA={() => setShowDuplicateWarning(false)}
        />
      )}

      {openModalConfirmAddMultiple && (
        <Modal
          contentType="withActions"
          text={`Você selecionou ${selectedOptions.length} colunas. Deseja criar todas de uma vez?`}
          onPressActionB={() => handleAddColumn(true)}
          onPressActionA={() => setOpenModalConfirmAddMultiple(false)}
        />
      )}

      {columnToEdit && (
        <Modal
          onClose={() => setColumnToEdit(null)}
          style={{ width: "100%" }}
          contentType="customModal"
        >
          <Text style={[styles.textModalColumn, { marginBottom: 0 }]}>
            Editar nome da coluna
          </Text>
          <Input
            style={{ gap: 0 }}
            value={editColumnName}
            onChangeText={(t) => {
              setEditColumnName(t);
              setEditError("");
            }}
          />
          {editError ? (
            <View style={styles.errorWrapper}>
              <FormErrorMessage message={editError} />
            </View>
          ) : null}
          <Button
            style={{ marginVertical: 15 }}
            title="Salvar Alteração"
            onPress={handleUpdateColumnName}
          />
        </Modal>
      )}

      {columnToDelete && (
        <Modal
          styleContainer={{ top: 20 }}
          contentType="withActions"
          text={`Ao excluir a coluna "${columnToDelete.name}" você vai apagar todas as tarefas vinculadas a ela, deseja continuar?`}
          onPressActionB={handleDeleteColumn}
          onPressActionA={() => setColumnToDelete(null)}
          onClose={() => setColumnToDelete(null)}
        />
      )}

      {taskToDelete && (
        <Modal
          styleContainer={{ top: 20 }}
          contentType="withActions"
          text={`Deseja realmente excluir a tarefa "${taskToDelete.nome}"?`}
          onPressActionB={handleDeleteTask}
          onPressActionA={() => setTaskToDelete(null)}
          onClose={() => setTaskToDelete(null)}
        />
      )}

      {openModalDeleteProject && (
        <Modal
          contentType={"withActions"}
          hasCloseButton={true}
          onClose={() => setOpenModalDeleteProject(false)}
          text={`Deseja excluir o projeto: "${project?.name}"?`}
          onPressActionB={handleDeleteProject}
          onPressActionA={() => setOpenModalDeleteProject(false)}
        />
      )}

      {actionLoading && (
        <Modal
          hasCloseButton={false}
          textLoading={textLoading}
          contentType="loading"
        />
      )}
      {successMessage !== "" && (
        <Modal
          styleContainer={{ top: 20 }}
          contentType="feedbackMessage"
          text={successMessage}
          hasCloseButton={false}
          onPress={handleCloseSuccess}
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
      {loadingFeedback && (
        <Modal hasCloseButton={false} loading={true} contentType="loading" />
      )}

      {openModalLegend && (
        <ModalLegendProjects
          style={{ flex: 1 }}
          legendContentItems={detailProjectLegendContent}
          subtitleContentItem="Explicando um pouco sobre a página do projeto."
          open={openModalLegend}
          onClose={() => setOpenModalLegend(false)}
        />
      )}
    </ThemedView>
  );
}
