import { ThemedView } from "@/app/components/themed-view";
import { Modal } from "@/app/components/ui/modal";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { deleteTask } from "@/app/services/tasks";
import { genericFormStyles } from "@/app/styles/genericFormStyles";
import { genericStyle } from "@/app/styles/genericStyles";
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
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createStyles } from "./styles";

export default function TaskDetail() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);

  const params = useLocalSearchParams<{
    id: string;
    projectId: string;
    nome: string;
    descricao: string;
    dataFinalizar: string;
    tempoExecucao: string;
    author: string;
    status: string;
    priority: string;
    columnId: string;
    columnName: string;
  }>();

  const otherInfos = [
    { label: "Status", value: params.status, icon: Activity },
    {
      label: "Prioridade",
      value: params.priority,
      icon: AlertCircle,
    },
    {
      label: "Coluna atual",
      value: params.columnName,
      icon: Columns,
    },
    {
      label: "Prazo de entrega",
      value: params.dataFinalizar,
      icon: Calendar,
    },
    {
      label: "Tempo estimado",
      value: params.tempoExecucao,
      icon: Clock,
    },
    { label: "Responsável", value: params.author, icon: User },
  ];

  const handleEdit = () => {
    router.push({
      pathname: "/(screens)/home/(tabs)/tasks/editTask/[id]",
      params: { ...params },
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
        <Text style={styles.title}>{params.nome || "Tarefa"}</Text>

        {/* SEÇÃO: AÇÕES */}
        <View style={styles.actionsWrapper}>
          <Pressable onPress={() => {}}>
            <Play size={22} color={colors.colorPrimary} />
          </Pressable>
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
                {params.descricao || "Nenhuma descrição fornecida."}
              </Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: colors.colorPrimary }} />

          {/* SEÇÃO: INFORMAÇÕES TÉCNICAS */}
          <View style={styles.othersInfosWrapper}>
            {otherInfos.map((item, index) => (
              <>
                {item.value && (
                  <View key={index} style={styles.otherInfosItems}>
                    <View style={styles.otherInfosicon}>
                      <item.icon size={20} color={colors.colorPrimary} />
                    </View>
                    <View style={{ width: "100%" }}>
                      <Text style={styles.otherInfosLabel}>{item.label}</Text>
                      <Text style={styles.otherInfosTitle}>
                        {item.value || "Não definido"}
                      </Text>
                    </View>
                  </View>
                )}
              </>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <Modal
          styleContainer={{ top: 20 }}
          contentType="withActions"
          text={`Deseja realmente excluir a tarefa "${params.nome}"?`}
          onPressActionB={confirmDelete}
          onPressActionA={() => setShowDeleteModal(false)}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      {/* Modal de Sucesso */}
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

      {/* Modal de Loading */}
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
