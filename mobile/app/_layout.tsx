import { useColorScheme } from "@/app/hooks/use-color-scheme.web";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { TaskTimerProvider } from "@/app/components/tasks/taskTimer/task-timer-context";
import { TaskTimerWidget } from "@/app/components/tasks/taskTimer/task-timer-widget";

LogBox.ignoreAllLogs(); // desabilita todos os warnings visuais

export const unstable_settings = {
  anchor: "(screens)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <TaskTimerProvider>
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
        <TaskTimerWidget />
        <StatusBar style="auto" />
      </TaskTimerProvider>
    </ThemeProvider>
  );
}
