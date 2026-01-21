import { Text, TextInput, View } from "react-native";
import auth from "@react-native-firebase/auth";
import { Redirect } from "expo-router";

export default function HomeScreen() {

    auth().onAuthStateChanged((currentUser) => {
        if (!currentUser) {
            <Redirect href="/(screens)/login/login" />;
        }
    });

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Home</Text>
            <TextInput>123</TextInput>
        </View>
    );
}
