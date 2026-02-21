import { ThemedView } from "@/app/components/themed-view";
import { Button } from "@/app/components/ui/button";
import { FormErrorMessage } from "@/app/components/ui/errorMessages/forms";
import { Input } from "@/app/components/ui/input";
import { Modal } from "@/app/components/ui/modal";
import { TextArea } from "@/app/components/ui/textarea";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { createTask } from "@/app/services/tasks";
import { genericFormStyles } from "@/app/styles/genericFormStyles";
import { genericStyle } from "@/app/styles/genericStyles";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { createStyles } from "./styles";

export default function AddTask() {
  const params = useLocalSearchParams<{
    projectId: string;
    columnId: string;
    columnName: string;
  }>();

  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  // Estado inicial centralizado para facilitar o reset
  const initialState = {
    nome: "",
    descricao: "",
    tempoExecucao: "",
    dataFinalizar: "",
    status: "não iniciada" as const,
  };

  const [form, setForm] = useState(initialState);

  const [errors, setErrors] = useState({
    nome: "",
  });

  // Limpa os campos sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      setForm(initialState);
      setErrors({ nome: "" });

      return () => {}; // Cleanup opcional
    }, []),
  );

  useEffect(() => {
    console.log("Parâmetros recebidos:", params);
  }, [params]);

  const handleSave = async () => {
    if (!form.nome.trim()) {
      setErrors({ nome: "O nome da tarefa é obrigatório" });
      return;
    }

    if (!params.projectId || !params.columnId) {
      Alert.alert(
        "Erro de Vínculo",
        "Não foi possível identificar o projeto ou a coluna destino.",
      );
      return;
    }

    const user = auth().currentUser;
    if (!user) return;

    setLoading(true);
    try {
      // O service agora cuida de salvar o author como displayName conforme configuramos antes
      await createTask(params.projectId, {
        nome: form.nome,
        descricao: form.descricao || "",
        tempoExecucao: form.tempoExecucao || "",
        dataFinalizar: form.dataFinalizar || "",
        status: form.status,
        columnId: params.columnId,
        projectId: params.projectId,
        author: user.displayName || "Usuário",
      });

      setSuccessMessage(true);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      setErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFeedback = () => {
    setSuccessMessage(false);
    router.back();
  };

  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      <Text style={styles.title}>Criar Tarefa</Text>
      <Text style={[styles.subtitle, { marginBottom: 10, color: "#888" }]}>
        Adicionando em:{" "}
        <Text style={{ fontWeight: "bold" }}>
          {params.columnName || "Coluna não identificada"}
        </Text>
      </Text>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
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
              value={form.nome}
              onChangeText={(t) => {
                setForm({ ...form, nome: t });
                setErrors({ nome: "" });
              }}
              placeholder="Ex: Criar tela de login"
            />
            {errors.nome ? <FormErrorMessage message={errors.nome} /> : null}
          </View>

          <TextArea
            id="descricaoTarefa"
            text="Descrição"
            value={form.descricao}
            onChangeText={(t) => setForm({ ...form, descricao: t })}
            placeholder="Descreva o que precisa ser feito..."
            numberOfLines={4}
          />

          <Input
            id="tempo"
            text="Tempo estimado (ex: 2h, 30min)"
            value={form.tempoExecucao}
            onChangeText={(t) => setForm({ ...form, tempoExecucao: t })}
            placeholder="Quanto tempo vai levar?"
          />

          <Input
            id="data"
            text="Data para finalizar"
            value={form.dataFinalizar}
            onChangeText={(t) => setForm({ ...form, dataFinalizar: t })}
            placeholder="DD/MM/AAAA"
          />

          <Button
            title="Criar Tarefa"
            style={[styles.button, { marginTop: 20 }]}
            onPress={handleSave}
            loading={loading}
          />
        </View>
      </ScrollView>

      {successMessage && (
        <Modal
          contentType="feedbackMessage"
          text="Tarefa criada com sucesso!"
          onPress={onFinishFeedback}
          hasCloseButton={false}
        />
      )}

      {errorMessage && (
        <Modal
          contentType="feedbackMessage"
          text="Não foi possível salvar a tarefa."
          onPress={() => setErrorMessage(false)}
          onClose={() => setErrorMessage(false)}
        />
      )}

      {loading && (
        <Modal
          hasCloseButton={false}
          textLoading="Criando tarefa..."
          contentType="loading"
        />
      )}
    </ThemedView>
  );
}
