import { ActionsButtonsProjects } from "@/app/components/projects/actionsButton";
import { ModalLegendProjects } from "@/app/components/projects/modalLegend";
import { ThemedView } from "@/app/components/themed-view";
import { Button } from "@/app/components/ui/button";
import { FormErrorMessage } from "@/app/components/ui/errorMessages/forms";
import { Input } from "@/app/components/ui/input";
import { TextArea } from "@/app/components/ui/textarea";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { createProject } from "@/app/services/projects";
import { genericFormStyles } from "@/app/styles/genericFormStyles";
import { genericStyle } from "@/app/styles/genericStyles";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native"; // Importação importante
import { Tabs, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { addProjectLegendContent } from "../constants";
import { createStyles } from "./styles";

export default function AddProjectScreens() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const router = useRouter();

  const [openModalLegend, setOpenModalLegend] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      resetForm();
      return () => resetForm();
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

      Alert.alert("Sucesso", "Projeto criado com sucesso!");
      resetForm(); // Limpa após salvar
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o projeto no momento.");
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
        style={{ width: "100%", height: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Preencha os detalhes básicos para iniciar seu novo projeto.
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
              text="Descrição (Opcional)"
              value={formData.descricaoProjeto}
              onChangeText={(text) =>
                handleValuesChange("descricaoProjeto", text)
              }
              placeholder="Explique o objetivo deste projeto..."
              numberOfLines={6}
              autoCorrect={true}
            />
          </View>

          <Button
            title="Criar Projeto"
            style={[styles.button, { marginTop: 10 }]}
            loading={loading}
            onPress={handleSave}
          />
        </View>
      </ScrollView>

      {openModalLegend && (
        <ModalLegendProjects
          legendContentItems={addProjectLegendContent}
          subtitleContentItem="Preencha os campos para organizar seu fluxo de trabalho."
          open={openModalLegend}
          onClose={() => setOpenModalLegend(false)}
        />
      )}
    </ThemedView>
  );
}
