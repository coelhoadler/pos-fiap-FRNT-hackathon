import { useFocusEffect } from "@react-navigation/native";
import { Tabs, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedView } from "@/app/components/themed-view";
import { Button } from "@/app/components/ui/button";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { IProjectService } from "@/app/interface/project";
import { addColumnToProject, getProjectById } from "@/app/services/projects";
import { genericStyle } from "@/app/styles/genericStyles";
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
    if (!newColumnName.trim() || !id) return;
    try {
      setLoading(true);
      await addColumnToProject(id, newColumnName);
      setNewColumnName("");
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text>{project?.name}</Text>

        <Text>{project?.description}</Text>

        <TouchableOpacity onPress={() => setOpenModalAddColumn(true)}>
          <Text>+ Nova Coluna</Text>
        </TouchableOpacity>

        {project?.columns?.map((column: any) => (
          <View key={column.id}>
            <Text>{column.title}</Text>
          </View>
        ))}
      </ScrollView>

      {openModalAddColumn && (
        <>
          <TextInput
            placeholder="Ex: To Do, Doing..."
            placeholderTextColor="#888"
            value={newColumnName}
            onChangeText={setNewColumnName}
            autoFocus
          />
          <Button
            title="Salvar"
            style={{ marginTop: 15 }}
            onPress={handleAddColumn}
          />
        </>
      )}
    </ThemedView>
  );
}
