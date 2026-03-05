import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import HomePage from "./index";

jest.mock("expo-router", () => ({
  router: { navigate: jest.fn() },
}));

jest.mock("@/app/hooks/use-color-scheme", () => ({
  useColorScheme: jest.fn(() => "light"),
}));

jest.mock("@/app/components/themed-view", () => {
  const { View } = require("react-native");
  return { ThemedView: ({ children, ...props }: any) => <View {...props}>{children}</View> };
});

jest.mock("@/app/components/home", () => {
  const { TouchableOpacity, Text } = require("react-native");
  return {
    CardHome: ({ title, description, onPressView }: any) => (
      <TouchableOpacity onPress={onPressView}>
        <Text>{title}</Text>
        {description && <Text>{description}</Text>}
      </TouchableOpacity>
    ),
  };
});

jest.mock("lucide-react-native", () => {
  const { Text } = require("react-native");
  return {
    FolderKanban: () => <Text>FolderKanban</Text>,
    CheckSquare: () => <Text>CheckSquare</Text>,
    Clock: () => <Text>Clock</Text>,
    Settings: () => <Text>Settings</Text>,
  };
});

import { router } from "expo-router";

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o texto introdutório", () => {
    render(<HomePage />);

    expect(screen.getByText("Conheça o MindEase")).toBeTruthy();
    expect(
      screen.getByText(
        "Este aplicativo foi feito para ser simples e fácil de usar. Aqui está o que você pode fazer para melhorar sua organização e foco no dia a dia."
      )
    ).toBeTruthy();
  });

  it("deve renderizar os 4 cards", () => {
    render(<HomePage />);

    expect(screen.getByText("Projetos")).toBeTruthy();
    expect(screen.getByText("Tarefas")).toBeTruthy();
    expect(screen.getByText("Modo Foco (Pomodoro)")).toBeTruthy();
    expect(screen.getByText("Preferências")).toBeTruthy();
  });

  it("deve renderizar as descrições dos cards", () => {
    render(<HomePage />);

    expect(
      screen.getByText(/Organize suas atividades criando Projetos/)
    ).toBeTruthy();
    expect(
      screen.getByText(/Dentro de cada projeto, você pode adicionar Tarefas/)
    ).toBeTruthy();
    expect(
      screen.getByText(/Use a ferramenta de Foco para se concentrar/)
    ).toBeTruthy();
    expect(
      screen.getByText(/Ajuste o aplicativo do seu jeito/)
    ).toBeTruthy();
  });

  it("deve navegar para projetos ao pressionar o card Projetos", () => {
    render(<HomePage />);

    fireEvent.press(screen.getByText("Projetos"));

    expect(router.navigate).toHaveBeenCalledWith(
      "/(screens)/home/(tabs)/projects/projects"
    );
  });

  it("deve navegar para projetos ao pressionar o card Tarefas", () => {
    render(<HomePage />);

    fireEvent.press(screen.getByText("Tarefas"));

    expect(router.navigate).toHaveBeenCalledWith(
      "/(screens)/home/(tabs)/projects/projects"
    );
  });

  it("deve navegar para pomodoro ao pressionar o card Modo Foco", () => {
    render(<HomePage />);

    fireEvent.press(screen.getByText("Modo Foco (Pomodoro)"));

    expect(router.navigate).toHaveBeenCalledWith(
      "/(screens)/home/(tabs)/pomodoro"
    );
  });

  it("deve navegar para preferências ao pressionar o card Preferências", () => {
    render(<HomePage />);

    fireEvent.press(screen.getByText("Preferências"));

    expect(router.navigate).toHaveBeenCalledWith(
      "/(screens)/home/(tabs)/preferences"
    );
  });
});
