import { IconSymbol } from "@/app/components/ui/icon-symbol";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useMenu } from "./menu-context";

export const HamburgerMenuButton: React.FC = () => {
  const colorScheme = useColorScheme();
  const { toggleMenu } = useMenu();

  return (
    <TouchableOpacity
      onPress={toggleMenu}
      style={styles.button}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <IconSymbol
        size={28}
        name="line.3.horizontal"
        color={Colors[colorScheme ?? "light"].text}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
  },
});
