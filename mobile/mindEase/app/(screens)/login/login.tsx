import { Redirect, router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

            <TouchableOpacity onPress={() => {
                doLogin(email, password);
            }}>
                <Text>Fazer Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                router.push('/(screens)/register/register');
            }}>
                <Text>Criar conta</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}
