import { ListItemProject } from "@/app/components/projects/listItemProject";
import { ThemedView } from "@/app/components/themed-view";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme.web";
import { genericStyle } from "@/app/styles/genericStyles";
import { ScrollView, Text } from "react-native";
import { createStyles } from "./styles";

export default function ProjectsScreens() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];
  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      <Text style={styles.title}>Meus Projetos</Text>
      <ScrollView style={{ width: "100%", height: "100%" }}>
        <ListItemProject
          nameProject="Projeto 1"
          onPressEdit={() => {}}
          onPressDelete={() => {}}
          onPressMoreOptions={() => {}}
          onPressView={() => {}}
        />
        <ListItemProject
          nameProject="Projeto 1"
          onPressEdit={() => {}}
          onPressDelete={() => {}}
          onPressMoreOptions={() => {}}
          onPressView={() => {}}
        />
        <ListItemProject
          nameProject="Projeto 1"
          onPressEdit={() => {}}
          onPressDelete={() => {}}
          onPressMoreOptions={() => {}}
          onPressView={() => {}}
        />
        <ListItemProject
          nameProject="Projeto 1"
          onPressEdit={() => {}}
          onPressDelete={() => {}}
          onPressMoreOptions={() => {}}
          onPressView={() => {}}
        />
      </ScrollView>
    </ThemedView>
  );
}
