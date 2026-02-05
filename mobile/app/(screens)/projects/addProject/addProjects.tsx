import { ThemedView } from "@/app/components/themed-view";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { TextArea } from "@/app/components/ui/textarea";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { genericStyle } from "@/app/styles/genericStyles";
import React, { useState } from "react";
import { ScrollView, Text } from "react-native";
import { createStyles } from "../styles";

export default function AddProjectScreens() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);

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

  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      <Text style={styles.title}>Adicionar novo projeto</Text>

      <ScrollView style={{ width: "100%", height: "100%" }}>
        <Text style={styles.title}>Preencha os dados</Text>

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
          onChangeText={(text) => handleValuesChange("descricaoProjeto", text)}
          placeholder="Descreva os detalhes do projeto..."
          numberOfLines={6}
        />

        <Button title="Salvar Projeto" onPress={handleSave} />
      </ScrollView>
    </ThemedView>
  );
}
