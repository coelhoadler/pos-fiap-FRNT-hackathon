import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";

import { HapticTab } from "@/app/components/haptic-tab";
import { IconSymbol } from "@/app/components/ui/icon-symbol";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { getPreferences } from "@/app/services/preferences";
import { Timer } from "lucide-react-native";
import { HamburgerMenuButton } from "../hamburger-menu-button";
import { HamburgerMenuDrawer } from "../hamburger-menu-drawer";

export const LayoutWithMenu: React.FC = () => {
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" = colorSchemeRaw ?? "dark";
  const colors = Colors[colorScheme];
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);

  useEffect(() => {
    getPreferences().then((prefs) => {
      setFocusModeEnabled(!!prefs?.focusMode);
    });
  }, []);

  return (
    <>
      <Tabs
        // backBehavior="history"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          headerLeftContainerStyle: { paddingLeft: 5, paddingTop: 2 },
          headerTitleStyle: {
            color: Colors[colorScheme ?? "light"].text,
          },
          headerLeft: () => <HamburgerMenuButton />,
          tabBarButton: HapticTab,
          // headerLeft: () => (
          //   <IconButton
          //     onPress={() => {
          //       if (router.canGoBack()) {
          //         router.back();
          //       } else {
          //         router.replace("/");
          //       }
          //     }}
          //     icon={
          //       <ArrowLeft
          //         size={22}
          //         color={Colors[colorScheme ?? "light"].text}
          //       />
          //     }
          //   />
          // ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Ínicio",
            headerTitle: "",
            // headerLeft: () => null,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pomodoro"
          options={{
            title: "Focar",
            href: focusModeEnabled ? undefined : null,
            tabBarIcon: ({ color }) => <Timer size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="preferences"
          options={{
            title: "Preferências",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="gearshape.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.circle.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="projects/projects"
          options={{
            href: null,
            title: "Projetos",
            headerTitle: "Projetos",
          }}
        />
        <Tabs.Screen
          name="projects/addProject"
          options={{
            href: null,
            title: "Novo Projeto",
            headerTitle: "Novo Projeto",
          }}
        />
        <Tabs.Screen
          name="pomodoro-settings"
          options={{
            href: null,
            title: "Configurações",
            headerTitle: "Configurações do Pomodoro",
          }}
        />
        <Tabs.Screen
          name="pomodoro-history"
          options={{
            href: null,
            title: "Histórico",
            headerTitle: "Histórico de execuções",
          }}
        />
        <Tabs.Screen
          name="projects/editProject/[id]"
          options={{
            href: null,
            title: "Editar Projeto",
            headerTitle: "Editar Projeto",
          }}
        />
      </Tabs>

      <HamburgerMenuDrawer />
    </>
  );
};
