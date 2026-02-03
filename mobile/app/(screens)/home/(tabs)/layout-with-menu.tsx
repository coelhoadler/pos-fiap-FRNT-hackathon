import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/app/components/haptic-tab";
import { IconSymbol } from "@/app/components/ui/icon-symbol";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { Timer } from "lucide-react-native";
import { HamburgerMenuButton } from "../hamburger-menu-button";
import { HamburgerMenuDrawer } from "../hamburger-menu-drawer";

export const LayoutWithMenu: React.FC = () => {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          headerLeft: () => <HamburgerMenuButton />,
          headerTitle: "",
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Ínicio",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="focus"
          options={{
            title: "Focar",
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
      </Tabs>
      <HamburgerMenuDrawer />
    </>
  );
};
