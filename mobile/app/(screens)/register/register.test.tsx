import { signUp, updateUserProfile } from "@/app/services/firebaseAuth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";
import RegisterScreen from "./register";

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
    signUp: jest.fn(),
    updateUserProfile: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => {
    const { Text } = require("react-native");
    return {
        Ionicons: () => <Text>Ionicons</Text>,
    };
});

describe("RegisterScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert');
    });

    it("deve renderizar os textos e inputs da tela de registro", () => {
        render(<RegisterScreen />);
        expect(screen.getByText("Criar Conta")).toBeTruthy();
        expect(screen.getByText("Preencha os dados para se cadastrar.")).toBeTruthy();
        expect(screen.getByPlaceholderText("Digite seu nome")).toBeTruthy();
        expect(screen.getByPlaceholderText("Digite seu e-mail")).toBeTruthy();
        expect(screen.getByPlaceholderText("Crie sua senha")).toBeTruthy();
        expect(screen.getByPlaceholderText("Confirme sua senha")).toBeTruthy();
        expect(screen.getByText("Cadastrar")).toBeTruthy();
    });

    it("deve exibir erro se os campos estiverem vazios e clicar em Cadastrar", () => {
        render(<RegisterScreen />);
        
        fireEvent.press(screen.getByText("Cadastrar"));

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Por favor, preencha seu nome.");
    });

    it("deve voltar para a tela de login ao clicar em Faça login", () => {
        const mockBack = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ back: mockBack });

        render(<RegisterScreen />);
        
        fireEvent.press(screen.getByText("Faça login"));
        expect(mockBack).toHaveBeenCalled();
    });

    it("deve validar chamadas da api de registro", async () => {
        (signUp as jest.Mock).mockResolvedValueOnce({ user: { uid: '123' } });
        (updateUserProfile as jest.Mock).mockResolvedValueOnce(true);

        render(<RegisterScreen />);
        
        fireEvent.changeText(screen.getByPlaceholderText("Digite seu nome"), "Usuário Teste");
        fireEvent.changeText(screen.getByPlaceholderText("Digite seu e-mail"), "teste@exemplo.com");
        fireEvent.changeText(screen.getByPlaceholderText("Crie sua senha"), "senha123");
        fireEvent.changeText(screen.getByPlaceholderText("Confirme sua senha"), "senha123");
        
        fireEvent.press(screen.getByText("Cadastrar"));

        await waitFor(() => {
            expect(signUp).toHaveBeenCalledWith("teste@exemplo.com", "senha123");
        });
        
        await waitFor(() => {
            expect(updateUserProfile).toHaveBeenCalledWith({ displayName: "Usuário Teste" });
        });
    });
});
