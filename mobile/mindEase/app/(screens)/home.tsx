import { Text, TextInput, View } from "react-native";

export default function HomeScreen() {
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
