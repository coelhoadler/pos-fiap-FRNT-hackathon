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
import {
  addColumnToProject,
  deleteColumnFromProject,
  deleteProject,
  getProjectById,
  updateColumnInProject,
} from "@/app/services/projects";
import { genericStyle } from "@/app/styles/genericStyles";
import {
  CheckSquare,
  EllipsisVertical,
  FileChartColumn,
  Pencil,
  Settings,
  Square,
  Trash2,
} from "lucide-react-native";
import { columnOptions } from "./constants";
import { createStyles } from "./styles";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  const [project, setProject] = useState<IProjectService | null>(null);

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

  const [columnsWithConflict, setColumnsWithConflict] = useState<string[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  const [columnToEdit, setColumnToEdit] =
    useState<IProjectServiceColumn | null>(null);
  const [editColumnName, setEditColumnName] = useState("");
  const [editError, setEditError] = useState("");
  const [columnToDelete, setColumnToDelete] =
    useState<IProjectServiceColumn | null>(null);

  const projectColumns = useMemo(
    () => project?.columns || [],
    [project?.columns],
  );

  const fetchProjectDetail = async () => {
    try {
      if (id) {
        const data = await getProjectById(id);
        setProject(data);
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
      setLoading(true);
      setProject(null);
      fetchProjectDetail();

      return () => {
        setActiveDropdownColumnId(null);
        setShowDropdownSetting(false);
        setProject(null);
        setLoading(true);
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
    }, 1000);
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
    setColumnToDelete(null);
    setTextLoading("Excluindo coluna...");
    setActionLoading(true);

    try {
      await deleteColumnFromProject(id!, columnToDelete);
      setSuccessMessage("Coluna excluída com sucesso!");
      fetchProjectDetail();
    } catch (error) {
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
              <TouchableOpacity
                onPress={() => setShowDropdownSetting(!showDropdownSetting)}
              >
                <Settings size={24} color={colors.text} />
              </TouchableOpacity>
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
                  <Accordion title={column.name}>
                    <Text style={{ color: colors.text }}>
                      Conteúdo da coluna...
                    </Text>
                  </Accordion>
                </View>
                <View>
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
                style={{ width: "80%", marginHorizontal: "auto" }}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* MODAL ADICIONAR COLUNAS */}
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

      {/* MODAL ALERTA DE DUPLICADOS */}
      {showDuplicateWarning && (
        <Modal
          onClose={() => setShowDuplicateWarning(false)}
          contentType="withActions"
          text={`As colunas (${columnsWithConflict.join(", ")}) já existem. Deseja criar mesmo assim?`}
          onPressActionB={() => handleAddColumn(true)}
          onPressActionA={() => setShowDuplicateWarning(false)}
        />
      )}

      {/* MODAL CONFIRMAÇÃO MÚLTIPLA */}
      {openModalConfirmAddMultiple && (
        <Modal
          contentType="withActions"
          text={`Você selecionou ${selectedOptions.length} colunas. Deseja criar todas de uma vez?`}
          onPressActionB={() => handleAddColumn(true)}
          onPressActionA={() => setOpenModalConfirmAddMultiple(false)}
        />
      )}

      {/* MODAL EDITAR NOME DA COLUNA */}
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

      {/* MODAL CONFIRMAR EXCLUSÃO COLUNA */}
      {columnToDelete && (
        <Modal
          styleContainer={{ top: 20 }}
          contentType="withActions"
          text={`Deseja excluir a coluna "${columnToDelete.name}"?`}
          onPressActionB={handleDeleteColumn}
          onPressActionA={() => setColumnToDelete(null)}
          onClose={() => setColumnToDelete(null)}
        />
      )}

      {/* MODAL CONFIRMAR EXCLUSÃO PROJETO */}
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

      {/* MODAIS DE LOADING E FEEDBACK */}
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
    </ThemedView>
  );
}
