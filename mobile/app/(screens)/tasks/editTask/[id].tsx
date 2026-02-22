import { ThemedView } from "@/app/components/themed-view";
import { Button } from "@/app/components/ui/button";
import { FormErrorMessage } from "@/app/components/ui/errorMessages/forms";
import { Input } from "@/app/components/ui/input";
import { Modal } from "@/app/components/ui/modal";
import { TextArea } from "@/app/components/ui/textarea";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { updateTask } from "@/app/services/tasks"; // Importando o serviço de update
import { genericFormStyles } from "@/app/styles/genericFormStyles";
import { genericStyle } from "@/app/styles/genericStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { createStyles } from "./styles";

export default function EditTask() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const router = useRouter();

  // Recebendo os parâmetros da tarefa via rota
  const {
    id,
    projectId,
    columnId,
    nome,
    descricao,
    tempoExecucao,
    dataFinalizar,
    status,
  } = useLocalSearchParams<{
    id: string;
    projectId: string;
    columnId: string;
    nome: string;
    descricao: string;
    tempoExecucao: string;
    dataFinalizar: string;
    status: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const [formData, setFormData] = useState({
    nome: nome || "",
    descricao: descricao || "",
    tempoExecucao: tempoExecucao || "",
    dataFinalizar: dataFinalizar || "",
    status: (status as any) || "não iniciada",
  });

  const [errors, setErrors] = useState({
    nome: "",
  });

  // Atualiza o form se os params mudarem
  useEffect(() => {
    setFormData({
      nome: nome || "",
      descricao: descricao || "",
      tempoExecucao: tempoExecucao || "",
      dataFinalizar: dataFinalizar || "",
      status: (status as any) || "não iniciada",
    });
  }, [nome, descricao, tempoExecucao, dataFinalizar, status]);

  // Verifica se houve alteração em relação aos dados originais
  const hasChanges =
    formData.nome !== (nome || "") ||
    formData.descricao !== (descricao || "") ||
    formData.tempoExecucao !== (tempoExecucao || "") ||
    formData.dataFinalizar !== (dataFinalizar || "");

  const handleValuesChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "nome" && value.trim()) {
      setErrors({ nome: "" });
    }
  };

  const handleUpdate = async () => {
    if (!formData.nome.trim()) {
      setErrors({ nome: "O nome da tarefa é obrigatório." });
      return;
    }

    setLoading(true);
    try {
      // Chama o serviço de atualização
      await updateTask(projectId, id, {
        nome: formData.nome,
        descricao: formData.descricao,
        tempoExecucao: formData.tempoExecucao,
        dataFinalizar: formData.dataFinalizar,
        status: formData.status,
        columnId: columnId,
      });

      setSuccessMessage(true);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      setErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFeedback = () => {
    setSuccessMessage(false);
    router.back(); // Volta para a tela de detalhes do projeto
  };

  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      <Text style={styles.title}>Editar Tarefa</Text>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Altere as informações abaixo para atualizar sua tarefa.
        </Text>

        <View style={styles.form}>
          {/* Campo Nome */}
          <View>
            <Input
              id="nomeTarefa"
              text={
                <View
                  style={[
                    genericFormStyles(colorScheme).wrapperRequiredIndication,
                  ]}
                >
                  <Text
                    style={[genericFormStyles(colorScheme).requiredIndication]}
                  >
                    *
                  </Text>
                  <Text style={[genericFormStyles(colorScheme).defaultLabel]}>
                    Nome da tarefa
                  </Text>
                </View>
              }
              value={formData.nome}
              onChangeText={(t) => handleValuesChange("nome", t)}
              placeholder="Ex: Criar tela de login"
            />
            {errors.nome ? <FormErrorMessage message={errors.nome} /> : null}
          </View>

          {/* Campo Descrição */}
          <TextArea
            id="descricaoTarefa"
            text="Descrição"
            value={formData.descricao}
            onChangeText={(t) => handleValuesChange("descricao", t)}
            placeholder="Descreva o que precisa ser feito..."
            numberOfLines={4}
          />

          {/* Campo Tempo */}
          <Input
            id="tempo"
            text="Tempo estimado (ex: 2h, 30min)"
            value={formData.tempoExecucao}
            onChangeText={(t) => handleValuesChange("tempoExecucao", t)}
            placeholder="Quanto tempo vai levar?"
          />

          {/* Campo Data */}
          <Input
            id="data"
            text="Data para finalizar"
            value={formData.dataFinalizar}
            onChangeText={(t) => handleValuesChange("dataFinalizar", t)}
            placeholder="DD/MM/AAAA"
          />

          {/* Botão Salvar */}
          <Button
            title="Salvar Alterações"
            style={[
              styles.button,
              { marginTop: 20 },
              (!hasChanges || loading) && { opacity: 0.6 },
            ]}
            onPress={handleUpdate}
            loading={loading}
            disabled={!hasChanges || loading}
          />
        </View>
      </ScrollView>

      {/* MODAIS DE FEEDBACK */}
      {successMessage && (
        <Modal
          contentType="feedbackMessage"
          text="Tarefa atualizada com sucesso!"
          onPress={onFinishFeedback}
          hasCloseButton={false}
        />
      )}

      {errorMessage && (
        <Modal
          contentType="feedbackMessage"
          text="Não foi possível atualizar a tarefa."
          onPress={() => setErrorMessage(false)}
          onClose={() => setErrorMessage(false)}
        />
      )}

      {loading && (
        <Modal
          hasCloseButton={false}
          textLoading="Atualizando tarefa..."
          contentType="loading"
        />
      )}
    </ThemedView>
  );
}
