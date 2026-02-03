import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme.web";
import { Text, View } from "react-native";
import { createStyles } from "./styles";

export default function ProjectsScreens() {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];
  return (
    <View>
      <Text>Projetos</Text>
    </View>
  );
}
