import { ActionsButtonsProjects } from "@/app/components/projects/actionsButton";
import { ModalLegendProjects } from "@/app/components/projects/modalLegend";
import { ThemedView } from "@/app/components/themed-view";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { TextArea } from "@/app/components/ui/textarea";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { genericStyle } from "@/app/styles/genericStyles";
import { Tabs } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { addProjectLegendContent } from "../constants";
import { createStyles } from "./styles";

export default function AddProjectScreens() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const [openModalLegend, setOpenModalLegend] = useState(false);

  const [formData, setFormData] = useState({
    nomeProjeto: "",
    descricaoProjeto: "",
  });

  const handleValuesChange = (id: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = () => {
    console.log("Dados prontos para salvar no Firebase:", formData);
  };

  const handleOpenModalLegend = () => {
    setOpenModalLegend(true);
  };

  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      <Tabs.Screen
        options={{
          headerRight: () => (
            <ActionsButtonsProjects
              onlyInformationButton
              pathAdd="/(screens)/home/(tabs)/projects/addProject"
              openModal={handleOpenModalLegend}
            />
          ),
        }}
      />

      <Text style={styles.title}>Criar Projeto</Text>

      <ScrollView style={{ width: "100%", height: "100%" }}>
        <Text style={styles.subtitle}>
          Preencha os dados para criar um novo projeto.
        </Text>

        <View style={styles.form}>
          <Input
            id="nomeProjeto"
            text="Nome do Projeto"
            value={formData.nomeProjeto}
            onChangeText={(text) => handleValuesChange("nomeProjeto", text)}
            placeholder="Ex: App de Finanças"
          />

          <TextArea
            id="descricaoProjeto"
            text="Descrição"
            value={formData.descricaoProjeto}
            onChangeText={(text) =>
              handleValuesChange("descricaoProjeto", text)
            }
            placeholder="Descreva os detalhes do projeto..."
            numberOfLines={6}
          />

          <Button
            title="Criar Projeto"
            style={styles.button}
            onPress={handleSave}
          />
        </View>
      </ScrollView>

      {openModalLegend && (
        <ModalLegendProjects
          legendContentItems={addProjectLegendContent}
          subtitleContentItem="Abaixo nós temos a explicação para essa página."
          open={openModalLegend}
          onClose={() => setOpenModalLegend(false)}
        />
      )}
    </ThemedView>
  );
}
