import { IconButton } from "@/app/components/ui/iconButton";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { genericStyle } from "@/app/styles/genericStyles";
import { CirclePlus, Info } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

export const ActionsButtonsProjects: React.FC = () => {
  const colorSchemeRaw = useColorScheme();
  const colorScheme: "light" | "dark" = colorSchemeRaw ?? "dark";
  const colors = Colors[colorScheme];

  return (
    <View style={genericStyle(colorScheme).headerRightButtons}>
      <IconButton icon={<CirclePlus size={28} color={colors.text} />} />
      <IconButton icon={<Info size={28} color={colors.text} />} />
    </View>
  );
};
