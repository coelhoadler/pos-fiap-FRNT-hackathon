import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { PreferencesItems } from "./preferencesItems";
import { IPreferencesItem } from "@/app/interface/preferences";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock("@/app/services/preferences", () => ({
    getPreferences: jest.fn(),
    savePreferences: jest.fn(),
}));

jest.mock("@/app/services/eventBus", () => ({
    eventBus: { emit: jest.fn() },
    PREFERENCES_UPDATED: "preferences-updated",
}));

jest.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
    __esModule: true,
    default: jest.fn(() => "light"),
}));

// Mocks simples dos componentes UI para isolar o comportamento
jest.mock("../themed-text", () => {
    const { Text } = require("react-native");
    return { ThemedText: (props: any) => <Text {...props} /> };
});

jest.mock("../themed-view", () => {
    const { View } = require("react-native");
    return { ThemedView: (props: any) => <View {...props} /> };
});

jest.mock("../ui/button", () => {
    const { TouchableOpacity, Text } = require("react-native");
    return {
        Button: ({ title, onPress }: any) => (
            <TouchableOpacity onPress={onPress}>
                <Text>{title}</Text>
            </TouchableOpacity>
        ),
    };
});

jest.mock("../ui/modal", () => {
    const { Text, TouchableOpacity } = require("react-native");
    return {
        Modal: ({ open, text, onPress, contentType, onPressActionA, onPressActionB, textButtonActionA, textButtonActionB, children }: any) => {
            if (!open) return null;
            if (contentType === "loading") return <Text>Carregando...</Text>;
            if (contentType === "feedbackMessage")
                return (
                    <TouchableOpacity onPress={onPress}>
                        <Text>{text}</Text>
                    </TouchableOpacity>
                );
            if (contentType === "withActions")
                return (
                    <>
                        {children}
                        <TouchableOpacity onPress={onPressActionA}>
                            <Text>{textButtonActionA}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onPressActionB}>
                            <Text>{textButtonActionB}</Text>
                        </TouchableOpacity>
                    </>
                );
            return null;
        },
    };
});

jest.mock("../ui/toggleItem/toggleItem", () => {
    const { Switch } = require("react-native");
    return {
        ToggleItem: ({ id, value, onChange }: any) => (
            <Switch testID={`toggle-${id}`} value={value} onValueChange={onChange} />
        ),
    };
});

import {
    getPreferences,
    savePreferences,
} from "@/app/services/preferences";
import { eventBus } from "@/app/services/eventBus";

const mockGetPreferences = getPreferences as jest.MockedFunction<typeof getPreferences>;
const mockSavePreferences = savePreferences as jest.MockedFunction<typeof savePreferences>;

const sampleItems: IPreferencesItem[] = [
    { id: "focusMode", title: "Modo Foco", description: "Ativa o modo foco" },
    { id: "summaryMode", title: "Modo Resumo" },
];

describe("PreferencesItems", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetPreferences.mockResolvedValue(null);
        mockSavePreferences.mockResolvedValue(undefined);
    });

    it("deve renderizar os itens de preferências", async () => {
        render(<PreferencesItems preferencesItems={sampleItems} />);

        await waitFor(() => {
            expect(screen.getByText("Modo Foco")).toBeTruthy();
            expect(screen.getByText("Modo Resumo")).toBeTruthy();
        });
    });

    it("deve renderizar a descrição quando fornecida", async () => {
        render(<PreferencesItems preferencesItems={sampleItems} />);

        await waitFor(() => {
            expect(screen.getByText("Ativa o modo foco")).toBeTruthy();
        });
    });

    it("não deve renderizar descrição quando ausente", async () => {
        const items: IPreferencesItem[] = [
            { id: "simple", title: "Simples" },
        ];
        render(<PreferencesItems preferencesItems={items} />);

        await waitFor(() => {
            expect(screen.getByText("Simples")).toBeTruthy();
        });
        expect(screen.queryByText("Ativa o modo foco")).toBeNull();
    });

    it("deve carregar preferências salvas ao montar", async () => {
        mockGetPreferences.mockResolvedValue({ focusMode: true, summaryMode: false });

        render(<PreferencesItems preferencesItems={sampleItems} />);

        await waitFor(() => {
            expect(mockGetPreferences).toHaveBeenCalledTimes(1);
        });
    });

    it("deve alternar o toggle ao interagir", async () => {
        render(<PreferencesItems preferencesItems={sampleItems} />);

        await waitFor(() => {
            expect(screen.getByTestId("toggle-focusMode")).toBeTruthy();
        });

        fireEvent(screen.getByTestId("toggle-focusMode"), "onValueChange", true);

        await waitFor(() => {
            expect(screen.getByTestId("toggle-focusMode").props.value).toBe(true);
        });
    });

    it("deve salvar preferências e emitir evento ao pressionar Salvar", async () => {
        render(<PreferencesItems preferencesItems={sampleItems} />);

        await waitFor(() => {
            expect(screen.getByText("Salvar")).toBeTruthy();
        });

        fireEvent.press(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(mockSavePreferences).toHaveBeenCalledWith({
                focusMode: false,
                summaryMode: false,
            });
            expect(eventBus.emit).toHaveBeenCalledWith("preferences-updated");
        });
    });

    it("deve exibir modal de sucesso após salvar", async () => {
        render(<PreferencesItems preferencesItems={sampleItems} />);

        await waitFor(() => {
            expect(screen.getByText("Salvar")).toBeTruthy();
        });

        fireEvent.press(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(screen.getByText("Preferências salvas com sucesso!")).toBeTruthy();
        });
    });

    it("deve exibir modal de confirmação ao pressionar 'Configurar mais tarde'", async () => {
        render(<PreferencesItems preferencesItems={sampleItems} />);

        await waitFor(() => {
            expect(screen.getByText("Configurar mais tarde")).toBeTruthy();
        });

        fireEvent.press(screen.getByText("Configurar mais tarde"));

        await waitFor(() => {
            expect(
                screen.getByText("Deseja mesmo configurar suas preferências mais tarde?")
            ).toBeTruthy();
        });
    });

    it("deve fechar modal ao pressionar 'Configurar agora'", async () => {
        render(<PreferencesItems preferencesItems={sampleItems} />);

        await waitFor(() => {
            expect(screen.getByText("Configurar mais tarde")).toBeTruthy();
        });

        fireEvent.press(screen.getByText("Configurar mais tarde"));

        await waitFor(() => {
            expect(screen.getByText("Configurar agora")).toBeTruthy();
        });

        fireEvent.press(screen.getByText("Configurar agora"));

        await waitFor(() => {
            expect(
                screen.queryByText("Deseja mesmo configurar suas preferências mais tarde?")
            ).toBeNull();
        });
    });

    it("deve navegar para index ao confirmar 'Configurar mais tarde'", async () => {
        render(<PreferencesItems preferencesItems={sampleItems} />);

        await waitFor(() => {
            expect(screen.getByText("Configurar mais tarde")).toBeTruthy();
        });

        fireEvent.press(screen.getByText("Configurar mais tarde"));

        await waitFor(() => {
            expect(screen.getByText("Confirmar")).toBeTruthy();
        });

        fireEvent.press(screen.getByText("Confirmar"));

        expect(mockNavigate).toHaveBeenCalledWith("index");
    });

    it("deve tratar erro ao carregar preferências sem quebrar", async () => {
        mockGetPreferences.mockRejectedValue(new Error("Erro de rede"));
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();

        render(<PreferencesItems preferencesItems={sampleItems} />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "Erro ao carregar preferências:",
                expect.any(Error)
            );
        });

        // Componente ainda renderiza normalmente
        expect(screen.getByText("Modo Foco")).toBeTruthy();
        consoleSpy.mockRestore();
    });

    it("deve tratar erro ao salvar preferências", async () => {
        mockSavePreferences.mockRejectedValue(new Error("Erro ao salvar"));
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();

        render(<PreferencesItems preferencesItems={sampleItems} />);

        await waitFor(() => {
            expect(screen.getByText("Salvar")).toBeTruthy();
        });

        fireEvent.press(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "Erro ao salvar preferências:",
                expect.any(Error)
            );
        });

        consoleSpy.mockRestore();
    });
});
