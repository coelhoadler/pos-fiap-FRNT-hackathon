import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
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
    <ThemedView style={[genericStyle(colorScheme).container, { padding: 20 }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.detailProject, { marginBottom: 4 }]}>
          {project?.name}
        </Text>
        <Text style={{ color: colors.text, opacity: 0.6, marginBottom: 24 }}>
          {project?.description}
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: colors.tint,
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
            marginBottom: 20,
          }}
          onPress={() => setOpenModalAddColumn(true)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            + Nova Coluna
          </Text>
        </TouchableOpacity>

        {/* Mapeamento das colunas (Accordion) */}
        {project?.columns?.map((column: any) => (
          <View
            key={column.id}
            style={{
              backgroundColor: colorScheme === "light" ? "#f0f0f0" : "#333",
              padding: 15,
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            {/* Aqui você pode inserir seu componente de Accordion futuramente */}
            <Text style={{ color: colors.text }}>{column.title}</Text>
          </View>
        ))}
      </ScrollView>

      {openModalAddColumn && (
        <>
          <TextInput
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.tint,
              color: colors.text,
              marginTop: 15,
              padding: 8,
              width: "100%",
            }}
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
