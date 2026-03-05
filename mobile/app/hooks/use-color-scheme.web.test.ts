import { renderHook, act } from "@testing-library/react-native";
import { useColorScheme } from "./use-color-scheme.web";

jest.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
  __esModule: true,
  default: jest.fn(() => "dark"),
}));

import useRNColorScheme from "react-native/Libraries/Utilities/useColorScheme";

const mockUseRNColorScheme = useRNColorScheme as jest.MockedFunction<
  typeof useRNColorScheme
>;

describe("useColorScheme (web)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRNColorScheme.mockReturnValue("dark");
  });

  it("deve retornar 'light' antes da hidratação", () => {
    let result: any;

    // Desabilita useEffect para capturar o estado pré-hidratação
    const useEffectSpy = jest
      .spyOn(require("react"), "useEffect")
      .mockImplementation(() => {});

    const { result: hookResult } = renderHook(() => useColorScheme());
    result = hookResult.current;

    expect(result).toBe("light");

    useEffectSpy.mockRestore();
  });

  it("deve retornar o colorScheme do sistema após hidratação", () => {
    mockUseRNColorScheme.mockReturnValue("dark");

    const { result } = renderHook(() => useColorScheme());

    expect(result.current).toBe("dark");
  });

  it("deve retornar 'light' quando o sistema usa tema claro", () => {
    mockUseRNColorScheme.mockReturnValue("light");

    const { result } = renderHook(() => useColorScheme());

    expect(result.current).toBe("light");
  });

  it("deve retornar null quando useRNColorScheme retorna null", () => {
    mockUseRNColorScheme.mockReturnValue(null);

    const { result } = renderHook(() => useColorScheme());

    expect(result.current).toBeNull();
  });
});
