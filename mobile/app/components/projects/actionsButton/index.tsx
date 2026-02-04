import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { IActionsButtonProjects } from "@/app/interface/actionsButton";
import { router } from "expo-router";
import { CirclePlus, Info } from "lucide-react-native";
import React from "react";
import { ActionsButtons } from "../../ui/actionsButton";
import { IconButton } from "../../ui/iconButton";
export const ActionsButtonsProjects: React.FC<IActionsButtonProjects> = ({
  pathAdd,
}) => {
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" = colorSchemeRaw ?? "dark";
  const colors = Colors[colorScheme];

  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  return (
    <ActionsButtons>
      <>
        <IconButton
          onPress={() => {
            pathAdd && navigateTo(pathAdd);
          }}
          icon={<CirclePlus size={28} color={colors.text} />}
        />
        <IconButton icon={<Info size={28} color={colors.text} />} />
      </>
    </ActionsButtons>
  );
};
