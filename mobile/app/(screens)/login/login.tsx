import { signIn } from "@/app/services/firebaseAuth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { styles } from "./styles";

export default function LoginScreen() {
  const router = useRouter();
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" | undefined = colorSchemeRaw ?? "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      // Carrega a preferência de biometria salva
      if (compatible) {
        const savedBiometricPref = await AsyncStorage.getItem('@biometric_enabled');
        if (savedBiometricPref !== null) {
          const isActivated = savedBiometricPref === 'true';
          setBiometricEnabled(isActivated);
          if (isActivated) {
            const success = await handleBiometricAuth();
            if (success) {
              const storedEmail = await AsyncStorage.getItem('@email');
              const storedPassword = await AsyncStorage.getItem('@password');
              if (storedEmail && storedPassword) {
                setEmail(storedEmail);
                setPassword(storedPassword);
                handleLogin(storedEmail, storedPassword);
              }
            }
          }
        }
      }

    })();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autentique-se para fazer login",
        cancelLabel: "Cancelar",
        requireConfirmation: false,
        disableDeviceFallback: false,
      });

      if (biometricAuth.success) {
        return true;
      } else {
        resetLoginData();
        handleBiometricDisable();
        return false;
      }
    } catch (error) {
      resetLoginData();
      return false;
    }
  };

  const handleLogin = async (emailToUse?: string, passwordToUse?: string) => {
    const loginEmail = (typeof emailToUse === "string") ? emailToUse : email;
    const loginPassword = (typeof passwordToUse === "string") ? passwordToUse : password;

    if (loginEmail === "" || loginPassword === "") {
      Toast.show({
        type: 'info',
        text1: 'Atenção',
        text2: '⚠️ Por favor, preencha todos os campos.',
        text1Style: { fontSize: 16, fontWeight: 'bold' },
        text2Style: { fontSize: 14 },
        swipeable: true,
      });
      return;
    }

    setIsLoading(true);

    signIn(loginEmail, loginPassword)
      .then(async () => {
        await AsyncStorage.setItem('@email', loginEmail);
        await AsyncStorage.setItem('@password', loginPassword);
        router.replace("/(screens)/home/(tabs)");
      })
      .catch((error) => {
        Alert.alert("Erro", "Falha no login: " + error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSignUp = () => {
    router.push("/(screens)/register/register");
  };

  // Salva a preferência quando o toggle é alterado
  const handleBiometricToggle = async (value: boolean) => {
    setBiometricEnabled(value);
    if (value) {
      await AsyncStorage.setItem('@biometric_enabled', value.toString());
    } else {
      await handleBiometricDisable();
    }
  };

  const handleBiometricDisable = async () => {
    setBiometricEnabled(false);
    await AsyncStorage.setItem('@biometric_enabled', 'false');
  }

  const resetLoginData = () => {
    setEmail("");
    setPassword("");
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

          <Text style={styles(colorScheme).title}>Bem-vindo!</Text>
          <Text style={styles(colorScheme).subtitle}>
            Faça login para continuar.
          </Text>

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
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={styles(colorScheme).icon}
            />
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

          {/* Toggle de Autenticação Biométrica */}
          {isBiometricSupported && (
            <View style={styles(colorScheme).biometricContainer}>
              <View style={styles(colorScheme).biometricTextContainer}>
                <Ionicons
                  name="finger-print-outline"
                  size={20}
                  color="#666"
                  style={styles(colorScheme).icon}
                />
                <Text style={styles(colorScheme).biometricText}>
                  Habilitar impressão digital
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={biometricEnabled ? "#007AFF" : "#f4f3f4"}
              />
            </View>
          )}
          {/* Botão de Login */}
          <TouchableOpacity
            style={styles(colorScheme).loginButton}
            onPress={() => handleLogin()}
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
            <Text style={styles(colorScheme).footerText}>
              Ainda não tem uma conta?{" "}
            </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles(colorScheme).signupText}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Toast />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
