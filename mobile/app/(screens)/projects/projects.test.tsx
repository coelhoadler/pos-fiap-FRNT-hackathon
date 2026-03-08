import { getPreferences } from "@/app/services/preferences";
import { getProjects } from "@/app/services/projects";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";
import Projects from "./projects";

jest.mock("expo-router", () => ({
    router: { push: jest.fn(), navigate: jest.fn() },
    Tabs: {
        Screen: () => null,
    },
}));

jest.mock("@/app/hooks/use-color-scheme", () => ({
    useColorScheme: jest.fn(() => "light"),
}));

jest.mock("@/app/services/projects", () => ({
    getProjects: jest.fn(),
    deleteProject: jest.fn(),
}));

jest.mock("@/app/services/preferences", () => ({
    getPreferences: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
    useFocusEffect: (cb: any) => require("react").useEffect(cb, []),
}));

jest.mock("@/app/components/themed-view", () => {
    const { View } = require("react-native");
    return { ThemedView: ({ children, ...props }: any) => <View {...props}>{children}</View> };
});

jest.mock("@/app/components/projects/projectsNotFound", () => {
    const { TouchableOpacity, Text, View } = require("react-native");
    return {
        ProjectsNotFound: ({ message, text, onPress }: any) => (
            <View>
                <Text>{message}</Text>
                <TouchableOpacity onPress={onPress}>
                    <Text>{text}</Text>
                </TouchableOpacity>
            </View>
        ),
    };
});

jest.mock("@/app/components/projects/listItemProject", () => {
    const { TouchableOpacity, Text, View } = require("react-native");
    return {
        ListItemProject: ({ nameProject, onPressView, onPressDelete, onPressEdit, onPressMoreOptions }: any) => (
            <View>
                <Text>{nameProject}</Text>
                <TouchableOpacity testID={`view-${nameProject}`} onPress={onPressView}>
                    <Text>Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity testID={`edit-${nameProject}`} onPress={onPressEdit}>
                    <Text>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity testID={`delete-${nameProject}`} onPress={onPressDelete}>
                    <Text>Deletar</Text>
                </TouchableOpacity>
                <TouchableOpacity testID={`more-${nameProject}`} onPress={onPressMoreOptions}>
                    <Text>Mais</Text>
                </TouchableOpacity>
            </View>
        ),
    };
});

jest.mock("@/app/components/ui/modal", () => {
    const { View, Text, TouchableOpacity } = require("react-native");
    return {
        Modal: ({ text, onPressActionA, onPressActionB, contentType }: any) => (
            <View testID="modal">
                <Text>{text}</Text>
                {contentType === 'withActions' && (
                    <>
                        <TouchableOpacity onPress={onPressActionA} testID="btn-cancel">
                            <Text>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onPressActionB} testID="btn-confirm">
                            <Text>Confirmar</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        ),
    };
});

describe("Projects Screen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getPreferences as jest.Mock).mockResolvedValue({ summaryMode: false });
    });

    it("deve renderizar a tela vazia de projetos", async () => {
        (getProjects as jest.Mock).mockResolvedValueOnce([]);
        
        render(<Projects />);

        await waitFor(() => {
            expect(screen.getByText("Meus Projetos")).toBeTruthy();
            expect(screen.getByText("Nenhum projeto encontrado")).toBeTruthy();
        });
    });

    it("deve listar os projetos", async () => {
        (getProjects as jest.Mock).mockResolvedValueOnce([
            { id: "1", name: "Projeto Fiap" },
            { id: "2", name: "Projeto Tech Challenge" }
        ]);

        render(<Projects />);

        await waitFor(() => {
            expect(screen.getByText("Projeto Fiap")).toBeTruthy();
            expect(screen.getByText("Projeto Tech Challenge")).toBeTruthy();
        });
    });

    it("deve navegar para adicionar projeto quando estiver vazio", async () => {
        (getProjects as jest.Mock).mockResolvedValueOnce([]);
        render(<Projects />);

        await waitFor(() => {
            fireEvent.press(screen.getByText("Crie um novo projeto"));
        });

        expect(router.navigate).toHaveBeenCalledWith("/(screens)/home/(tabs)/projects/addProject");
    });
});
