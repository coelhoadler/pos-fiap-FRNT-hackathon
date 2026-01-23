import { PreferencesItems } from "@/components/preferencesItems/preferencesItems";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { preferencesConstantsItems } from "./constants";
import { styles } from "./styles";

export default function Preferences() {
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" | undefined = colorSchemeRaw ?? "dark";

  return (
    <SafeAreaView style={styles(colorScheme).container}>
      <Text>Preferences</Text>
      <PreferencesItems preferencesItems={preferencesConstantsItems} />
    </SafeAreaView>
  );
}
