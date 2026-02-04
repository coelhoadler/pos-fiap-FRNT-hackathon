import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/app/components/haptic-tab";
import { ActionsButtonsProjects } from "@/app/components/projects/actionsButton";
import { IconSymbol } from "@/app/components/ui/icon-symbol";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { Timer } from "lucide-react-native";
import { HamburgerMenuButton } from "../hamburger-menu-button";
import { HamburgerMenuDrawer } from "../hamburger-menu-drawer";

export const LayoutWithMenu: React.FC = () => {
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" = colorSchemeRaw ?? "dark";
  const colors = Colors[colorScheme];

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
          name="explore"
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
        <Tabs.Screen
          name="projects/projects"
          options={{
            href: null,
            title: "Projetos",
            headerTitle: "Projetos",
            // headerRight: () => (
            //   <>
            //     <ActionsButtonsProjects
            //       pathAdd={"/(screens)/home/(tabs)/projects/addProject"}
            //     />
            //   </>
            // ),
          }}
        />
        <Tabs.Screen
          name="projects/addProject"
          options={{
            href: null,
            title: "Novo Projeto",
            headerTitle: "Novo Projeto",
            headerRight: () => (
              <>{<ActionsButtonsProjects onlyInformationButton />}</>
            ),
          }}
        />
      </Tabs>
      <HamburgerMenuDrawer />
    </>
  );
};
