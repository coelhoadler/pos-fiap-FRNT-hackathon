import { signIn } from "@/app/services/firebaseAuth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";
import LoginScreen from "./login";

jest.mock("expo-router", () => ({
    useRouter: jest.fn(() => ({
        replace: jest.fn(),
        push: jest.fn(),
        back: jest.fn(),
    })),
}));

jest.mock("@/app/hooks/use-color-scheme", () => ({
    useColorScheme: jest.fn(() => "light"),
}));

jest.mock("@/app/services/firebaseAuth", () => ({
    signIn: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock("expo-local-authentication", () => ({
    hasHardwareAsync: jest.fn(() => Promise.resolve(false)),
    authenticateAsync: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => {
    const { Text } = require("react-native");
    return {
        Ionicons: () => <Text>Ionicons</Text>,
    };
});

jest.mock("react-native-toast-message", () => {
    const { View } = require("react-native");
    return {
        __esModule: true,
        default: Object.assign(() => <View testID="toast-message" />, {
            show: jest.fn(),
        }),
    };
});

describe("LoginScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar elementos da tela de login", () => {
        render(<LoginScreen />);
        expect(screen.getByText("Bem-vindo!")).toBeTruthy();
        expect(screen.getByText("Faça login para continuar.")).toBeTruthy();
        expect(screen.getByPlaceholderText("Digite seu email")).toBeTruthy();
        expect(screen.getByPlaceholderText("Sua senha")).toBeTruthy();
        expect(screen.getByText("Entrar")).toBeTruthy();
    });

    it("deve exibir toast informativo se os campos estiverem vazios e clicar em Entrar", async () => {
        render(<LoginScreen />);
        
        fireEvent.press(screen.getByText("Entrar"));

        await waitFor(() => {
            expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({ type: 'info' }));
        });
    });

    it("deve tentar realizar o login com email e senha", async () => {
        (signIn as jest.Mock).mockResolvedValueOnce({ user: { uid: '123' } });
        render(<LoginScreen />);
        
        fireEvent.changeText(screen.getByPlaceholderText("Digite seu email"), "test@exemplo.com");
        fireEvent.changeText(screen.getByPlaceholderText("Sua senha"), "123456");
        fireEvent.press(screen.getByText("Entrar"));

        await waitFor(() => {
            expect(signIn).toHaveBeenCalledWith("test@exemplo.com", "123456");
        });
    });

    it("deve ir para a tela de registro ao clicar em Cadastre-se", () => {
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        render(<LoginScreen />);
        
        fireEvent.press(screen.getByText("Cadastre-se"));
        expect(mockPush).toHaveBeenCalledWith("/(screens)/register/register");
    });
});
