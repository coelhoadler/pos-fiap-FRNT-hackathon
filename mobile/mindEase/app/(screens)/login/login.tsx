import React, { useState } from "react";
import { Button } from "@react-navigation/elements";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signIn } from "../../services/firebaseAuth";
import doLogin from "./services/login";

export default function LoginScreen() {

    const [email, setEmail] = useState('adlercoelhosantos12@gmail.com');
    const [password, setPassword] = useState('Adler12345@');

    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Login</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
            />
            <Button onPress={() => doLogin(email, password)}>Logar</Button>
        </SafeAreaView>
    );
}
