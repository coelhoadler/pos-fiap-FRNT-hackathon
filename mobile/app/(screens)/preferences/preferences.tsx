import { PreferencesItems } from "@/components/preferencesItems/preferencesItems";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { genericStyle } from "@/styles/genericStyles";
import { preferencesConstantsItems } from "./constants";
import { styles } from "./styles";

export default function Preferences() {
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" | undefined = colorSchemeRaw ?? "dark";

  return (
    <ThemedView style={genericStyle(colorScheme).container}>
      <ThemedView style={styles(colorScheme).wrapperContent}>
        <PreferencesItems preferencesItems={preferencesConstantsItems} />
      </ThemedView>
    </ThemedView>
  );
}
