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
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { signIn } from '@/app/services/firebaseAuth';

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('adlercoelhosantos12@gmail.com');
    const [password, setPassword] = useState('Adler12345@');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        if (email === '' || password === '') {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        signIn(email, password).then(() => {
            router.replace('/(screens)/home/home');
        }).catch((error) => {
            Alert.alert('Erro', 'Falha no login: ' + error.message);
        });
    };

    const handleSignUp = () => {
        router.push('/(screens)/register/register');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>

                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../../assets/images/logotipo.png')} // <--- Caminho da imagem
                            style={styles.logo}
                        />
                    </View>

                    <Text style={styles.title}>Bem-vindo!</Text>
                    <Text style={styles.subtitle}>Faça login para continuar.</Text>

                    {/* Input de Email */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Input de Senha */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                        <TextInput
                            style={styles.input}
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
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>ENTRAR</Text>
                    </TouchableOpacity>

                    {/* Link de Cadastro */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Ainda não tem uma conta? </Text>
                        <TouchableOpacity onPress={handleSignUp}>
                            <Text style={styles.signupText}>Cadastre-se</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

