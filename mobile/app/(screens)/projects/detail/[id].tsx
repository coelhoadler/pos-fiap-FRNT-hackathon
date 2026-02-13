import { useFocusEffect } from "@react-navigation/native";
import { Tabs, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { ThemedView } from "@/app/components/themed-view";
import { AddContentButton } from "@/app/components/ui/addContentButton";
import { Button } from "@/app/components/ui/button";
import { FormErrorMessage } from "@/app/components/ui/errorMessages/forms";
import { Input } from "@/app/components/ui/input";
import { Modal } from "@/app/components/ui/modal";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { IProjectService } from "@/app/interface/project";
import { addColumnToProject, getProjectById } from "@/app/services/projects";
import { genericStyle } from "@/app/styles/genericStyles";
import { FileChartColumn } from "lucide-react-native";
import { createStyles } from "./styles";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  const [project, setProject] = useState<IProjectService | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModalAddColumn, setOpenModalAddColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [error, setError] = useState("");

  const fetchProjectDetail = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await getProjectById(id);
        setProject(data);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProjectDetail();
    }, [id]),
  );

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) {
      setError("O campo 'nome da coluna' é obrigatório.");
      return;
    }

    if (!id) return;

    try {
      setLoading(true);
      await addColumnToProject(id, newColumnName);
      setNewColumnName("");
      setError("");
      setOpenModalAddColumn(false);
      fetchProjectDetail();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView
      style={[genericStyle(colorScheme).container, styles.detailProject]}
    >
      <Tabs.Screen
        options={{
          headerTitle: project?.name || "Carregando...",
        }}
      />

      <Text style={styles.title}>{project?.name}</Text>
      <Text style={styles.description}>{project?.description}</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <>
          {project?.columns?.length === 0 ? (
            <View style={styles.wrapperMessageNoColumn}>
              <View style={styles.itemMessageNoColumn}>
                <FileChartColumn size={35} color={colors.colorPrimary} />
                <Text style={styles.noColumnTitle}>Nenhuma coluna ainda</Text>
                <Text style={styles.noColumnDescription}>
                  Clique abaixo para criar sua coluna.
                </Text>
              </View>
              <AddContentButton
                onPress={() => setOpenModalAddColumn(true)}
                text="Criar coluna"
              />
            </View>
          ) : (
            <>
              <AddContentButton
                onPress={() => setOpenModalAddColumn(true)}
                text="Adicione uma nova coluna"
              />
              {project?.columns?.map((column: any) => (
                <View key={column.id}>
                  <Text>{column.title}</Text>
                </View>
              ))}
            </>
          )}
        </>
      </ScrollView>

      {openModalAddColumn && (
        <>
          <Modal
            style={{ width: "100%" }}
            onClose={() => {
              setOpenModalAddColumn(false);
              setError("");
              setNewColumnName("");
            }}
            contentType="customModal"
          >
            <Text style={styles.textModalColumn}>
              Preencha o campo abaixo para criar a coluna.
            </Text>
            <Input
              text={"Digite o nome da coluna"}
              value={newColumnName}
              onChangeText={(text) => {
                setNewColumnName(text);
                if (error) setError("");
              }}
              id={project?.id || ""}
            />
            {error ? <FormErrorMessage message={error} /> : null}
            <Button
              title="Salvar"
              style={styles.btnModalColumn}
              onPress={handleAddColumn}
            />
          </Modal>
        </>
      )}
    </ThemedView>
  );
}
