import { useColorScheme } from "@/app/hooks/use-color-scheme.web";
import { Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";

export default function RegisterScreen() {

    const colorSchemeRaw = useColorScheme();
    const colorScheme: 'light' | 'dark' | undefined = colorSchemeRaw ?? 'dark';

    return (
        <SafeAreaView
            style={styles(colorScheme).container}
        >
            <Text>Criar conta</Text>
            <TextInput>123</TextInput>
        </SafeAreaView>
    );
}
