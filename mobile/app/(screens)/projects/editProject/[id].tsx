import { ActionsButtonsProjects } from "@/app/components/projects/actionsButton";
import { ModalLegendProjects } from "@/app/components/projects/modalLegend";
import { ThemedView } from "@/app/components/themed-view";
import { Button } from "@/app/components/ui/button";
import { FormErrorMessage } from "@/app/components/ui/errorMessages/forms";
import { Input } from "@/app/components/ui/input";
import { Modal } from "@/app/components/ui/modal";
import { TextArea } from "@/app/components/ui/textarea";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { updateProject } from "@/app/services/projects";
import { genericFormStyles } from "@/app/styles/genericFormStyles";
import { genericStyle } from "@/app/styles/genericStyles";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { createStyles } from "../addProject/styles";
import { editProjectLegendContent } from "../constants";

export default function EditProject() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const router = useRouter();

  const { id, name, description } = useLocalSearchParams<{
    id: string;
    name: string;
    description: string;
  }>();

  const [openModalLegend, setOpenModalLegend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [loadingToProjectsList, setLoadingToProjectsList] = useState(false);

  const [formData, setFormData] = useState({
    nomeProjeto: name || "",
    descricaoProjeto: description || "",
  });

  useEffect(() => {
    setFormData({
      nomeProjeto: name || "",
      descricaoProjeto: description || "",
    });
  }, [name, description]);

  const [errors, setErrors] = useState({
    nomeProjeto: "",
  });

  const hasChanges =
    formData.nomeProjeto !== (name || "") ||
    formData.descricaoProjeto !== (description || "");

  const returnToProjectsList = () => {
    setSuccessMessage(false);
    setLoadingToProjectsList(true);
    setTimeout(() => {
      router.replace("/(screens)/home/(tabs)/projects/projects");
      setLoadingToProjectsList(false);
    }, 1000);
  };

  const handleValuesChange = (id: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (id === "nomeProjeto" && value.trim()) {
      setErrors({ nomeProjeto: "" });
    }
  };

  const handleUpdate = async () => {
    if (!formData.nomeProjeto.trim()) {
      setErrors({ nomeProjeto: "O nome do projeto é obrigatório." });
      return;
    }

    setLoading(true);
    try {
      await updateProject(id, {
        name: formData.nomeProjeto,
        description: formData.descricaoProjeto,
      });

      setSuccessMessage(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      <Tabs.Screen
        options={{
          headerTitle: "Editar Projeto",
          headerRight: () => (
            <ActionsButtonsProjects
              onlyInformationButton
              openModal={() => setOpenModalLegend(true)}
            />
          ),
        }}
      />

      <Text style={styles.title}>Editar Projeto</Text>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Altere as informações abaixo para atualizar seu projeto.
        </Text>

        <View style={styles.form}>
          <View>
            <Input
              id="nomeProjeto"
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
                    Nome do Projeto
                  </Text>
                </View>
              }
              value={formData.nomeProjeto}
              onChangeText={(text) => handleValuesChange("nomeProjeto", text)}
              placeholder="Ex: Desenvolvimento E-commerce"
              autoCorrect={true}
            />
            {errors.nomeProjeto && (
              <FormErrorMessage message={errors.nomeProjeto} />
            )}
          </View>

          <View>
            <TextArea
              id="descricaoProjeto"
              text="Descrição"
              value={formData.descricaoProjeto}
              onChangeText={(text) =>
                handleValuesChange("descricaoProjeto", text)
              }
              placeholder="Explique sobre o projeto..."
              autoCorrect={true}
            />
          </View>

          <Button
            title="Salvar Alterações"
            style={[
              styles.button,
              (!hasChanges || loading) && { opacity: 0.6 },
            ]}
            onPress={handleUpdate}
            loading={loading}
            disabled={!hasChanges || loading}
          />
        </View>
      </ScrollView>

      {openModalLegend && (
        <ModalLegendProjects
          legendContentItems={editProjectLegendContent}
          subtitleContentItem="Editando as informações do seu projeto."
          open={openModalLegend}
          onClose={() => setOpenModalLegend(false)}
        />
      )}

      {loading && (
        <Modal
          hasCloseButton={false}
          textLoading="Editando projeto"
          contentType="loading"
        />
      )}

      {successMessage && (
        <Modal
          contentType={"feedbackMessage"}
          text="Projeto atualizado com sucesso!"
          hasCloseButton={false}
          onPress={returnToProjectsList}
        />
      )}

      {errorMessage && (
        <Modal
          contentType={"feedbackMessage"}
          text="Erro ao atualizar projeto."
          onClose={() => setErrorMessage(false)}
          onPress={() => setErrorMessage(false)}
        />
      )}
      {loadingToProjectsList && (
        <Modal hasCloseButton={false} loading={true} contentType="loading" />
      )}
    </ThemedView>
  );
}
