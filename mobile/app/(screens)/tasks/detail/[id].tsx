import { ThemedView } from "@/app/components/themed-view";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { genericStyle } from "@/app/styles/genericStyles";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import {
  AlignLeft,
  ArrowLeft,
  Calendar,
  Clock,
  User,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./styles";

export default function TaskDetail() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];
  const router = useRouter();

  // Capturando os parâmetros passados pela rota
  const { id, nome, descricao, dataFinalizar, tempoExecucao, author } =
    useLocalSearchParams<{
      id: string;
      nome: string;
      descricao: string;
      dataFinalizar: string;
      tempoExecucao: string;
      author: string;
    }>();

  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      {/* Configuração da navegação superior */}
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

      <Text style={styles.title}>{nome || "Tarefa"}</Text>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 24, paddingVertical: 10 }}>
          {/* SEÇÃO: DESCRIÇÃO */}
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <AlignLeft size={20} color={colors.colorPrimary} />
              <Text style={[styles.subtitle, { marginBottom: 0 }]}>
                Descrição
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.background,
                padding: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.colorPrimary + "20", // cor com transparência
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  lineHeight: 24,
                  textAlign: "justify",
                }}
              >
                {descricao ||
                  "Nenhuma descrição detalhada foi fornecida para esta tarefa."}
              </Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: colors.text + "10" }} />

          {/* SEÇÃO: INFORMAÇÕES TÉCNICAS */}
          <View style={{ gap: 16 }}>
            {/* DATA DE ENTREGA */}
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={{
                  backgroundColor: colors.colorPrimary + "15",
                  padding: 8,
                  borderRadius: 6,
                }}
              >
                <Calendar size={20} color={colors.colorPrimary} />
              </View>
              <View>
                <Text style={{ color: colors.text + "80", fontSize: 12 }}>
                  Prazo de entrega
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {dataFinalizar || "Não definido"}
                </Text>
              </View>
            </View>

            {/* TEMPO DE EXECUÇÃO */}
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={{
                  backgroundColor: colors.colorPrimary + "15",
                  padding: 8,
                  borderRadius: 6,
                }}
              >
                <Clock size={20} color={colors.colorPrimary} />
              </View>
              <View>
                <Text style={{ color: colors.text + "80", fontSize: 12 }}>
                  Tempo estimado
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {tempoExecucao || "00:00"}
                </Text>
              </View>
            </View>

            {/* RESPONSÁVEL */}
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={{
                  backgroundColor: colors.colorPrimary + "15",
                  padding: 8,
                  borderRadius: 6,
                }}
              >
                <User size={20} color={colors.colorPrimary} />
              </View>
              <View>
                <Text style={{ color: colors.text + "80", fontSize: 12 }}>
                  Responsável
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {author || "Sem responsável"}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                color: colors.text + "40",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              ID da Tarefa: {id}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
