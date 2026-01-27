import { IToggleItem } from "@/app/interface/toogle";
import { Colors } from "@/constants/theme";
import React from "react";
import { Pressable, Switch, useColorScheme } from "react-native";
import { createStyles } from "./styles";

export const ToggleItem: React.FC<IToggleItem> = ({
  value,
  onChange,
  disabled = false,
  containerStyle,
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  createStyles(colorScheme);

  const handleToggle = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  return (
    <Pressable
      onPress={handleToggle}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      style={containerStyle}
    >
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: "white", true: "white" }}
        thumbColor={
          colorScheme === "light"
            ? Colors.light.buttonBackground
            : Colors.dark.buttonBackground
        }
        ios_backgroundColor={
          colorScheme === "light"
            ? Colors.light.buttonBackground
            : Colors.dark.buttonBackground
        }
      />
    </Pressable>
  );
};
