import { PreferencesItems } from "@/app/components/preferencesItems/preferencesItems";
import { ThemedView } from "@/app/components/themed-view";
import { useColorScheme } from "@/app/hooks/use-color-scheme.web";
import { genericStyle } from "@/app/styles/genericStyles";
import { preferencesConstantsItems } from "./constants";
import { styles } from "./styles";

export default function Preferences() {
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" = colorSchemeRaw ?? "dark";

  return (
    <ThemedView style={genericStyle(colorScheme).container}>
      <ThemedView style={styles(colorScheme).wrapperContent}>
        <PreferencesItems preferencesItems={preferencesConstantsItems} />
      </ThemedView>
    </ThemedView>
  );
}
