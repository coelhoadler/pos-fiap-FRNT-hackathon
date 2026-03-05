import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { CardHome } from "./index";
import { Text } from "react-native";

jest.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
  __esModule: true,
  default: jest.fn(() => "light"),
}));

describe("CardHome", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título corretamente", () => {
    render(<CardHome title="Meu Título" />);
    expect(screen.getByText("Meu Título")).toBeTruthy();
  });

  it("deve renderizar a descrição quando fornecida", () => {
    render(<CardHome title="Título" description="Descrição do card" />);
    expect(screen.getByText("Descrição do card")).toBeTruthy();
  });

  it("não deve renderizar a descrição quando não fornecida", () => {
    render(<CardHome title="Título" />);
    expect(screen.queryByText("Descrição do card")).toBeNull();
  });

  it("deve renderizar o ícone quando fornecido", () => {
    const icon = <Text>icon-test</Text>;
    render(<CardHome title="Título" icon={icon} />);
    expect(screen.getByText("icon-test")).toBeTruthy();
  });

  it("deve renderizar o botão com texto padrão 'Saiba mais' quando onPressView é fornecido sem textButton", () => {
    const onPress = jest.fn();
    render(<CardHome title="Título" onPressView={onPress} />);
    expect(screen.getByText("Saiba mais")).toBeTruthy();
  });

  it("deve renderizar o botão com textButton customizado quando fornecido", () => {
    const onPress = jest.fn();
    render(
      <CardHome title="Título" onPressView={onPress} textButton="Ver mais" />
    );
    expect(screen.getByText("Ver mais")).toBeTruthy();
  });

  it("não deve renderizar o botão quando onPressView não é fornecido", () => {
    render(<CardHome title="Título" />);
    expect(screen.queryByText("Saiba mais")).toBeNull();
  });

  it("deve chamar onPressView ao pressionar o botão", () => {
    const onPress = jest.fn();
    render(<CardHome title="Título" onPressView={onPress} />);
    fireEvent.press(screen.getByText("Saiba mais"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("deve ser acessível (accessible=true)", () => {
    const { getByLabelText } = render(
      <CardHome title="Título" />
    );
    // Percorre a árvore para encontrar o View com accessible=true
    const titleEl = screen.getByText("Título");
    let node = titleEl.parent;
    while (node && !node.props.accessible) {
      node = node.parent;
    }
    expect(node?.props.accessible).toBe(true);
  });
});
