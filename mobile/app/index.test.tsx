import React from "react";
import { render } from "@testing-library/react-native";
import Index from "./index";

jest.mock("expo-router", () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text } = require("react-native");
    return <Text>{href}</Text>;
  },
}));

jest.mock("./services/firebaseAuth", () => ({
  isAuthenticated: jest.fn(),
}));

import { isAuthenticated } from "./services/firebaseAuth";

const mockIsAuthenticated = isAuthenticated as jest.MockedFunction<typeof isAuthenticated>;

describe("Index", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve redirecionar para home quando o usuário está autenticado", () => {
    mockIsAuthenticated.mockReturnValue(true);

    const { getByText } = render(<Index />);

    expect(getByText("/(screens)/home/(tabs)")).toBeTruthy();
  });

  it("deve redirecionar para login quando o usuário não está autenticado", () => {
    mockIsAuthenticated.mockReturnValue(false);

    const { getByText } = render(<Index />);

    expect(getByText("/(screens)/login/login")).toBeTruthy();
  });
});
