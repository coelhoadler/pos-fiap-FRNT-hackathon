import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
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
                        title: "Tarefas",
                        tabBarIcon: ({ color }) => (
                            <IconSymbol size={28} name="house.fill" color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="explore"
                    options={{
                        title: "Focar",
                        tabBarIcon: ({ color }) => (
                            <IconSymbol size={28} name="paperplane.fill" color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="modal"
                    options={{
                        title: "Preferências",
                        tabBarIcon: ({ color }) => (
                            <IconSymbol size={28} name="gearshape.fill" color={color} />
                        ),
                    }}
                />
            </Tabs>
            <HamburgerMenuDrawer />
        </>
    );
};
