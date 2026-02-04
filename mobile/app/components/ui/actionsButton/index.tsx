import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { IActionsButton } from "@/app/interface/actionsButton";
import { genericStyle } from "@/app/styles/genericStyles";
import React from "react";
import { View } from "react-native";
export const ActionsButtons: React.FC<IActionsButton> = ({ children }) => {
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" = colorSchemeRaw ?? "dark";
  const colors = Colors[colorScheme];
  return (
    <View style={genericStyle(colorScheme).headerRightButtons}>{children}</View>
  );
};
