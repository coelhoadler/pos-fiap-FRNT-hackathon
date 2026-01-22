import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { signIn } from '@/app/services/firebaseAuth';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
    const router = useRouter();
    const colorSchemeRaw = useColorScheme();
    const colorScheme: 'light' | 'dark' | undefined = colorSchemeRaw ?? 'dark';

    const [email, setEmail] = useState('adlercoelhosantos12@gmail.com');
    const [password, setPassword] = useState('Adler12345@');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        if (email === '' || password === '') {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setIsLoading(true);
        signIn(email, password).then(() => {
            router.replace('/(screens)/home/(tabs)');
        }).catch((error) => {
            Alert.alert('Erro', 'Falha no login: ' + error.message);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const handleSignUp = () => {
        router.push('/(screens)/register/register');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles(colorScheme).container}
            >
                <View style={styles(colorScheme).content}>

                    <View style={styles(colorScheme).logoContainer}>
                        <Image
                            source={require('../../../assets/images/logotipo.png')}
                            style={styles(colorScheme).logo}
                        />
                    </View>

                    <Text style={styles(colorScheme).title}>Bem-vindo!</Text>
                    <Text style={styles(colorScheme).subtitle}>Faça login para continuar.</Text>

                    {/* Input de Email */}
                    <View style={styles(colorScheme).inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#666" style={styles(colorScheme).icon} />
                        <TextInput
                            style={styles(colorScheme).input}
                            placeholder="Digite seu email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Input de Senha */}
                    <View style={styles(colorScheme).inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles(colorScheme).icon} />
                        <TextInput
                            style={styles(colorScheme).input}
                            placeholder="Sua senha"
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

                    {/* Botão de Login */}
                    <TouchableOpacity
                        style={styles(colorScheme).loginButton}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles(colorScheme).loginButtonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    {/* Link de Cadastro */}
                    <View style={styles(colorScheme).footer}>
                        <Text style={styles(colorScheme).footerText}>Ainda não tem uma conta? </Text>
                        <TouchableOpacity onPress={handleSignUp}>
                            <Text style={styles(colorScheme).signupText}>Cadastre-se</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

