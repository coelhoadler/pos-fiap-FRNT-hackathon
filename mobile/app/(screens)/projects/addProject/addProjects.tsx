import { ThemedView } from "@/app/components/themed-view";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { genericStyle } from "@/app/styles/genericStyles";
import { ScrollView, Text } from "react-native";
import { createStyles } from "../styles";

export default function AddProjectScreens() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);

  return (
    <ThemedView style={[genericStyle(colorScheme).container, styles.container]}>
      <Text style={styles.title}>Adicionar novo projeto</Text>

      <ScrollView style={{ width: "100%", height: "100%" }}>
        <Text style={styles.title}>Adicionar</Text>
      </ScrollView>
    </ThemedView>
  );
}
