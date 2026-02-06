import { ActionsButtonsProjects } from "@/app/components/projects/actionsButton";
import { ModalLegendProjects } from "@/app/components/projects/modalLegend";
import { ThemedView } from "@/app/components/themed-view";
import { Button } from "@/app/components/ui/button";
import { FormErrorMessage } from "@/app/components/ui/errorMessages/forms";
import { Input } from "@/app/components/ui/input";
import { Modal } from "@/app/components/ui/modal";
import { TextArea } from "@/app/components/ui/textarea";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { createProject } from "@/app/services/projects";
import { genericFormStyles } from "@/app/styles/genericFormStyles";
import { genericStyle } from "@/app/styles/genericStyles";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native"; // Importação importante
import { Tabs, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { addProjectLegendContent } from "../constants";
import { createStyles } from "./styles";

export default function AddProjectScreens() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const router = useRouter();

  const [openModalLegend, setOpenModalLegend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingToProjectsList, setLoadingToProjectsList] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const [formData, setFormData] = useState({
    nomeProjeto: "",
    descricaoProjeto: "",
  });

  const [errors, setErrors] = useState({
    nomeProjeto: "",
  });

  const resetForm = () => {
    setFormData({
      nomeProjeto: "",
      descricaoProjeto: "",
    });
    setErrors({
      nomeProjeto: "",
    });
  };

  const returnToProjectsList = () => {
    setSuccessMessage(false);
    setLoadingToProjectsList(true);
    setTimeout(() => {
      router.navigate("/(screens)/home/(tabs)/projects/projects");
      setLoadingToProjectsList(false);
    }, 1000);
  };

  useFocusEffect(
    useCallback(() => {
      resetForm();
      return () => {
        resetForm();
        setOpenModalLegend(false);
      };
    }, []),
  );

  const handleValuesChange = (id: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "nomeProjeto" && value.trim()) {
      setErrors({ nomeProjeto: "" });
    }
  };

  const handleSave = async () => {
    if (!formData.nomeProjeto.trim()) {
      setErrors({
        nomeProjeto: "O nome do projeto é obrigatório para continuar.",
      });
      return;
    }

    setLoading(true);
    try {
      const user = auth().currentUser;

      await createProject({
        name: formData.nomeProjeto,
        description: formData.descricaoProjeto,
        userId: user?.uid || "",
        columns: [],
      });

      setSuccessMessage(true);
      resetForm();
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
          headerRight: () => (
            <ActionsButtonsProjects
              onlyInformationButton
              pathAdd="/(screens)/home/(tabs)/projects/addProject"
              openModal={() => setOpenModalLegend(true)}
            />
          ),
        }}
      />

      <Text style={styles.title}>Criar Projeto</Text>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Preencha os campos para criar seu novo projeto.
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
            {errors.nomeProjeto ? (
              <FormErrorMessage message={errors.nomeProjeto} />
            ) : null}
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
              numberOfLines={6}
              autoCorrect={true}
            />
          </View>

          <Button
            title="Criar Projeto"
            style={[styles.button]}
            onPress={handleSave}
            loading={loading}
          />
        </View>
      </ScrollView>

      {openModalLegend && (
        <ModalLegendProjects
          legendContentItems={addProjectLegendContent}
          subtitleContentItem="Explicando um pouco sobre a página de criação de projeto."
          open={openModalLegend}
          onClose={() => setOpenModalLegend(false)}
        />
      )}

      {successMessage && (
        <Modal
          contentType={"feedbackMessage"}
          text="Projeto criado com sucesso"
          hasCloseButton={false}
          onPress={returnToProjectsList}
        />
      )}
      {errorMessage && (
        <Modal
          contentType={"feedbackMessage"}
          text="Não foi possível salvar o projeto no momento."
          onClose={() => setErrorMessage(false)}
          onPress={() => setErrorMessage(false)}
        />
      )}

      {loading && (
        <Modal
          hasCloseButton={false}
          textLoading="Criando projeto"
          contentType="loading"
        />
      )}

      {loadingToProjectsList && (
        <Modal hasCloseButton={false} loading={true} contentType="loading" />
      )}
    </ThemedView>
  );
}
