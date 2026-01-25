import { signUp, updateUserProfile } from "@/app/services/firebaseAuth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { styles } from "./styles";

export default function RegisterScreen() {
    const router = useRouter();
    const colorSchemeRaw = useColorScheme();
    const colorScheme: 'light' | 'dark' | undefined = colorSchemeRaw ?? 'dark';

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (): boolean => {
        // Validação de campos vazios
        if (name.trim() === "") {
            Alert.alert("Erro", "Por favor, preencha seu nome.");
            return false;
        }

        if (email.trim() === "") {
            Alert.alert("Erro", "Por favor, preencha seu e-mail.");
            return false;
        }

        if (password.trim() === "") {
            Alert.alert("Erro", "Por favor, preencha sua senha.");
            return false;
        }

        if (confirmPassword.trim() === "") {
            Alert.alert("Erro", "Por favor, confirme sua senha.");
            return false;
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Erro", "Por favor, insira um e-mail válido.");
            return false;
        }

        // Validação de senha
        if (password.length < 6) {
            Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
            return false;
        }

        // Validação de confirmação de senha
        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return false;
        }

        return true;
    };

    const handleRegister = () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        signUp(email, password)
            .then((userCredential) => {
                // Atualizar o perfil do usuário com o nome
                return updateUserProfile({ displayName: name });
            })
            .then(() => {
                Alert.alert(
                    "Sucesso",
                    "Conta criada com sucesso!",
                    [
                        {
                            text: "OK",
                            onPress: () => router.replace("/(screens)/home/(tabs)")
                        }
                    ]
                );
            })
            .catch((error) => {
                let errorMessage = "Ocorreu um erro ao criar a conta.";

                if (error.code === "auth/email-already-in-use") {
                    errorMessage = "Este e-mail já está em uso.";
                } else if (error.code === "auth/invalid-email") {
                    errorMessage = "E-mail inválido.";
                } else if (error.code === "auth/weak-password") {
                    errorMessage = "A senha é muito fraca.";
                } else if (error.message) {
                    errorMessage = error.message;
                }

                Alert.alert("Erro", errorMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleBackToLogin = () => {
        router.back();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles(colorScheme).container}
            >
                <View style={styles(colorScheme).content}>
                    <View style={styles(colorScheme).logoContainer}>
                        <Image
                            source={require("../../../assets/images/logotipo.png")}
                            style={styles(colorScheme).logo}
                        />
                    </View>

                    <Text style={styles(colorScheme).title}>Criar Conta</Text>
                    <Text style={styles(colorScheme).subtitle}>
                        Preencha os dados para se cadastrar.
                    </Text>

                    {/* Input de Nome */}
                    <View style={styles(colorScheme).inputContainer}>
                        <Ionicons
                            name="person-outline"
                            size={20}
                            color="#666"
                            style={styles(colorScheme).icon}
                        />
                        <TextInput
                            style={styles(colorScheme).input}
                            placeholder="Digite seu nome"
                            placeholderTextColor="#999"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>

                    {/* Input de Email */}
                    <View style={styles(colorScheme).inputContainer}>
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color="#666"
                            style={styles(colorScheme).icon}
                        />
                        <TextInput
                            style={styles(colorScheme).input}
                            placeholder="Digite seu e-mail"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Input de Senha */}
                    <View style={styles(colorScheme).inputContainer}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color="#666"
                            style={styles(colorScheme).icon}
                        />
                        <TextInput
                            style={styles(colorScheme).input}
                            placeholder="Crie sua senha"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Input de Confirmação de Senha */}
                    <View style={styles(colorScheme).inputContainer}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color="#666"
                            style={styles(colorScheme).icon}
                        />
                        <TextInput
                            style={styles(colorScheme).input}
                            placeholder="Confirme sua senha"
                            placeholderTextColor="#999"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Ionicons
                                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Botão de Cadastro */}
                    <TouchableOpacity
                        style={styles(colorScheme).registerButton}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles(colorScheme).registerButtonText}>Cadastrar</Text>
                        )}
                    </TouchableOpacity>

                    {/* Link de Login */}
                    <View style={styles(colorScheme).footer}>
                        <Text style={styles(colorScheme).footerText}>
                            Já tem uma conta?{" "}
                        </Text>
                        <TouchableOpacity onPress={handleBackToLogin}>
                            <Text style={styles(colorScheme).loginText}>Faça login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}
