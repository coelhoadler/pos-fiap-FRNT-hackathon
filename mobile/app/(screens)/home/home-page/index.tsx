import { CardHome } from "@/app/components/home";
import { ThemedView } from "@/app/components/themed-view";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { genericStyle } from "@/app/styles/genericStyles";
import { router } from "expo-router";
import {
  CheckSquare,
  Clock,
  FolderKanban,
  Settings,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { createStyles } from "./styles";

export default function HomePage() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  const customNavigationTo = (path: any) => {
    router.navigate(path);
  };
  const navigationToProjects = () => {
    customNavigationTo("/(screens)/home/(tabs)/projects/projects");
  };
  const navigationToTasks = () => {
    navigationToProjects();
  };
  const navigationToFocusMode = () => {
    customNavigationTo("/(screens)/home/(tabs)/pomodoro");
  };
  const navigationToPreferences = () => {
    customNavigationTo("/(screens)/home/(tabs)/preferences");
  };

  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introContainer}>
          <Text style={styles.subtitle}>Conheça o MindEase</Text>
          <Text style={styles.introText}>
            Este aplicativo foi feito para ser simples e fácil de usar. Aqui
            está o que você pode fazer para melhorar sua organização e foco no
            dia a dia.
          </Text>
        </View>

        <CardHome
          style={{ marginTop: 20 }}
          onPressView={navigationToProjects}
          title="Projetos"
          description="Organize suas atividades criando Projetos diferentes para cada área da sua vida."
          icon={<FolderKanban color={colors.colorPrimary} size={32} />}
        />

        <CardHome
          title="Tarefas"
          onPressView={navigationToTasks}
          description="Dentro de cada projeto, você pode adicionar Tarefas passo a passo para não se perder e saber o que precisa ser feito."
          icon={<CheckSquare color={colors.colorPrimary} size={32} />}
        />
        <CardHome
          title="Modo Foco (Pomodoro)"
          icon={<Clock color={colors.colorPrimary} size={32} />}
          description="Use a ferramenta de Foco para se concentrar em uma tarefa de cada vez. Ela possui pausas automáticas para você descansar a mente."
          onPressView={navigationToFocusMode}
        />
        <CardHome
          title="Preferências"
          onPressView={navigationToPreferences}
          icon={<Settings color={colors.colorPrimary} size={32} />}
          description="Ajuste o aplicativo do seu jeito. Na página de Preferências, você pode escolher opções visuais para tornar o uso mais confortável."
        />
      </ScrollView>
    </ThemedView>
  );
}
