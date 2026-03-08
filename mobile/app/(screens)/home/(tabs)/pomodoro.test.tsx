import { getPomodoroSettings } from "@/app/services/pomodoroSettings";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import React from "react";
import PomodoroScreen from "./pomodoro";

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useFocusEffect: (cb: any) => require("react").useEffect(cb, []),
  router: {
    push: mockPush,
    replace: mockReplace,
  },
}));

jest.mock("@/app/services/pomodoroSettings", () => ({
  getPomodoroSettings: jest.fn(),
}));

jest.mock("@/app/services/pomodoroHistory", () => ({
  savePomodoroHistory: jest.fn(),
}));

jest.mock("@/app/services/soundService", () => ({
  setupAudioMode: jest.fn(),
  playDoneSound: jest.fn(),
  playBackgroundMusic: jest.fn(),
  pauseBackgroundMusic: jest.fn(),
  stopBackgroundMusic: jest.fn(),
}));

jest.mock("react-native-toast-message", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: Object.assign(() => <View testID="toast-message" />, {
      show: jest.fn(),
    }),
  };
});

jest.mock("@/app/components/themed-view", () => {
  const { View } = require("react-native");
  return {
    ThemedView: ({ children, style, ...props }: any) => (
      <View style={style} {...props}>
        {children}
      </View>
    ),
  };
});

jest.mock("@/app/components/themed-text", () => {
  const { Text } = require("react-native");
  return {
    ThemedText: ({ children, style, ...props }: any) => (
      <Text style={style} {...props}>
        {children}
      </Text>
    ),
  };
});

describe("Pomodoro Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (getPomodoroSettings as jest.Mock).mockResolvedValue({
      pomodoroTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      musicEnabled: false,
      soundEnabledWhenFinish: true,
      autoStartBreak: false,
      autoStartPomodoro: false,
    });
  });

  it("deve carregar com tela de carregamento", async () => {
    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    (getPomodoroSettings as jest.Mock).mockReturnValue(promise);

    render(<PomodoroScreen />);

    expect(screen.getByText("Carregando...")).toBeTruthy();

    resolvePromise({ pomodoroTime: 25 });
  });

  it("deve renderizar a tela do pomodoro quando configurações estão prontas", async () => {
    render(<PomodoroScreen />);

    await waitFor(() => {
      expect(screen.getByText("POMODORO")).toBeTruthy();
      expect(screen.getByText("25:00")).toBeTruthy();
      expect(screen.getByText("Iniciar")).toBeTruthy();
      expect(screen.getByText("Histórico")).toBeTruthy();
      expect(screen.getByText("Configurações")).toBeTruthy();
    });
  });

  it("deve redirecionar para settings se nao houver configuracoes", async () => {
    (getPomodoroSettings as jest.Mock).mockResolvedValueOnce(null);
    render(<PomodoroScreen />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        "/(screens)/home/(tabs)/pomodoro-settings",
      );
    });
  });

  it("deve navegar para a tela de historico ao clicar em Historico", async () => {
    render(<PomodoroScreen />);

    await waitFor(() => {
      expect(screen.getByText("Histórico")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Histórico"));
    expect(mockPush).toHaveBeenCalledWith(
      "/(screens)/home/(tabs)/pomodoro-history",
    );
  });

  it("deve navegar para a tela de configurações ao clicar em Configurações", async () => {
    render(<PomodoroScreen />);

    await waitFor(() => {
      expect(screen.getByText("Configurações")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Configurações"));
    expect(mockPush).toHaveBeenCalledWith(
      "/(screens)/home/(tabs)/pomodoro-settings",
    );
  });
});
