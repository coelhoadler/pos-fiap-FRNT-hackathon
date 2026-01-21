import { Button } from "@react-navigation/elements";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signIn } from "../services/firebaseAuth";

export default function LoginScreen() {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Login</Text>
            <TextInput>123</TextInput>

            <Button onPress={() => signIn('test@example.com', 'password')}>Logar</Button>
        </SafeAreaView>
    );
}
