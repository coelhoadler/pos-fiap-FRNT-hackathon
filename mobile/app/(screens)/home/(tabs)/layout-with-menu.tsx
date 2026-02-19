import { Tabs, router } from "expo-router";
import React, { useEffect, useState } from "react";

import { HapticTab } from "@/app/components/haptic-tab";
import { IconSymbol } from "@/app/components/ui/icon-symbol";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { eventBus, PREFERENCES_UPDATED } from "@/app/services/eventBus";
import { getPreferences } from "@/app/services/preferences";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { ArrowLeft, Timer } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { HamburgerMenuDrawer } from "../hamburger-menu-drawer";
import { useMenu } from "../menu-context";
import { TabsRoutes } from "./tabsRouters";

const MenuTabButton: React.FC<BottomTabBarButtonProps> = (props) => {
  const { toggleMenu } = useMenu();
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      {...(props as any)}
      onPress={(e) => {
        e.preventDefault();
        toggleMenu();
      }}
      style={[props.style, { justifyContent: "center", alignItems: "center" }]}
    />
  );
};

export const LayoutWithMenu: React.FC = () => {
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" = colorSchemeRaw ?? "dark";
  const colors = Colors[colorScheme];
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);

  const loadFocusMode = () => {
    getPreferences().then((prefs) => {
      setFocusModeEnabled(!!prefs?.focusMode);
    });
  };

  useEffect(() => {
    loadFocusMode();
    const unsubscribe = eventBus.on(PREFERENCES_UPDATED, loadFocusMode);
    return unsubscribe;
  }, []);

  return (
    <>
      <Tabs
        // backBehavior="history"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          headerLeftContainerStyle: { paddingLeft: 0, paddingTop: 2 },
          headerTitleStyle: {
            color: Colors[colorScheme ?? "light"].text,
          },
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
            headerTitle: "Bem vinda(o) de volta!",
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
            headerTitle: "Meu Perfil",
            href: null,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.circle.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menu",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="line.3.horizontal" color={color} />
            ),
            tabBarButton: (props) => <MenuTabButton {...props} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
            },
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
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.navigate(`/(screens)/home/(tabs)/${TabsRoutes.Focus}`)}
                style={{ paddingHorizontal: 10 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ArrowLeft size={22} color={Colors[colorScheme].text} />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="pomodoro-history"
          options={{
            href: null,
            title: "Histórico",
            headerTitle: "Histórico de execuções",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.navigate(`/(screens)/home/(tabs)/${TabsRoutes.Focus}`)}
                style={{ paddingHorizontal: 10 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ArrowLeft size={22} color={Colors[colorScheme].text} />
              </TouchableOpacity>
            ),
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
        <Tabs.Screen
          name="projects/detail/[id]"
          options={{
            href: null,
            title: "Detalhe do Projeto",
            headerTitle: "Detalhe do Projeto",
          }}
        />
      </Tabs>

      <HamburgerMenuDrawer />
    </>
  );
};
