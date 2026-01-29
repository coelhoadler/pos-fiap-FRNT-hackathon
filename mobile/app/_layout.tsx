import { useColorScheme } from "@/app/hooks/use-color-scheme.web";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export const unstable_settings = {
  anchor: "(screens)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(screens)/home/(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/login/login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/register/register"
          options={{ headerBackButtonMenuEnabled: true, headerTitle: "" }}
        />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
