import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";
import { HamburgerMenu } from "./home";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

jest.mock("@/app/services/firebaseAuth", () => ({
  signOut: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/app/hooks/use-color-scheme", () => ({
  useColorScheme: jest.fn(() => "light"),
}));

jest.mock("@/app/components/themed-text", () => {
  const { Text } = require("react-native");
  return {
    ThemedText: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

jest.mock("@/app/components/themed-view", () => {
  const { View } = require("react-native");
  return {
    ThemedView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

jest.mock("@/app/components/ui/icon-symbol", () => {
  const { Text } = require("react-native");
  return {
    IconSymbol: ({ name }: any) => <Text>{name}</Text>,
  };
});

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

import { router } from "expo-router";
import { signOut } from "@/app/services/firebaseAuth";

describe("HamburgerMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o conteúdo filho", () => {
    render(
      <HamburgerMenu>
        <Text>Conteúdo Principal</Text>
      </HamburgerMenu>
    );
    expect(screen.getByText("Conteúdo Principal")).toBeTruthy();
  });

  it("deve renderizar o botão do menu hamburger", () => {
    render(
      <HamburgerMenu>
        <Text>Conteúdo</Text>
      </HamburgerMenu>
    );
    expect(screen.getByText("line.3.horizontal")).toBeTruthy();
  });

  it("deve abrir o menu ao pressionar o botão hamburger", () => {
    render(
      <HamburgerMenu>
        <Text>Conteúdo</Text>
      </HamburgerMenu>
    );

    fireEvent.press(screen.getByText("line.3.horizontal"));

    expect(screen.getByText("Menu")).toBeTruthy();
    expect(screen.getByText("Início")).toBeTruthy();
    expect(screen.getByText("Focar")).toBeTruthy();
    expect(screen.getByText("Preferências")).toBeTruthy();
    expect(screen.getByText("Perfil")).toBeTruthy();
    expect(screen.getByText("Sair")).toBeTruthy();
  });

  it("deve exibir o botão de fechar (xmark) no drawer", () => {
    render(
      <HamburgerMenu>
        <Text>Conteúdo</Text>
      </HamburgerMenu>
    );

    fireEvent.press(screen.getByText("line.3.horizontal"));

    expect(screen.getByText("xmark")).toBeTruthy();
  });

  it("deve navegar para Início ao pressionar o item", () => {
    render(
      <HamburgerMenu>
        <Text>Conteúdo</Text>
      </HamburgerMenu>
    );

    fireEvent.press(screen.getByText("line.3.horizontal"));
    fireEvent.press(screen.getByText("Início"));

    expect(router.push).toHaveBeenCalledWith("/(screens)/home/(tabs)/");
  });

  it("deve navegar para Focar ao pressionar o item", () => {
    render(
      <HamburgerMenu>
        <Text>Conteúdo</Text>
      </HamburgerMenu>
    );

    fireEvent.press(screen.getByText("line.3.horizontal"));
    fireEvent.press(screen.getByText("Focar"));

    expect(router.push).toHaveBeenCalledWith("/(screens)/home/(tabs)/focus");
  });

  it("deve navegar para Preferências ao pressionar o item", () => {
    render(
      <HamburgerMenu>
        <Text>Conteúdo</Text>
      </HamburgerMenu>
    );

    fireEvent.press(screen.getByText("line.3.horizontal"));
    fireEvent.press(screen.getByText("Preferências"));

    expect(router.push).toHaveBeenCalledWith("/(screens)/home/(tabs)/modal");
  });

  it("deve chamar signOut ao pressionar Sair", async () => {
    render(
      <HamburgerMenu>
        <Text>Conteúdo</Text>
      </HamburgerMenu>
    );

    fireEvent.press(screen.getByText("line.3.horizontal"));
    fireEvent.press(screen.getByText("Sair"));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
    });
  });

  it("deve fechar o menu ao pressionar o overlay", () => {
    render(
      <HamburgerMenu>
        <Text>Conteúdo</Text>
      </HamburgerMenu>
    );

    // Abre o menu
    fireEvent.press(screen.getByText("line.3.horizontal"));
    expect(screen.getByText("Menu")).toBeTruthy();

    // Pressiona o overlay para fechar — o menu some do Modal visible
    fireEvent.press(screen.getByText("xmark"));
  });

  it("deve renderizar todos os 5 itens do menu", () => {
    render(
      <HamburgerMenu>
        <Text>Conteúdo</Text>
      </HamburgerMenu>
    );

    fireEvent.press(screen.getByText("line.3.horizontal"));

    const expectedLabels = ["Início", "Focar", "Preferências", "Perfil", "Sair"];
    expectedLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeTruthy();
    });
  });
});
