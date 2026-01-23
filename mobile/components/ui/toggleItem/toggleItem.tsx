import { IToggleItemProps } from "@/app/interface/toogleItem";
import { Colors } from "@/constants/theme";
import React from "react";
import { Pressable, Switch, useColorScheme } from "react-native";
import { createStyles } from "./styles";

export const ToggleItem: React.FC<IToggleItemProps> = ({
  value,
  onChange,
  disabled = false,
  containerStyle,
  id,
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const scaleRatio = 1.3;

  const handleToggle = () => {
    if (disabled) return;
    onChange(!value);
  };
  const formatarId = (id: string) => {
    return id
      ? id
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9]/g, "")
          .toLowerCase()
      : "";
  };

  return (
    <Pressable
      onPress={handleToggle}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      style={({ pressed }) => [
        styles.container,
        containerStyle,
        pressed && !disabled && styles.pressed,
      ]}
      id={formatarId(id)}
    >
      <Switch
        style={{
          transform: [{ scaleX: scaleRatio }, { scaleY: scaleRatio }],
        }}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{
          false: "white",
          true: "white",
        }}
        thumbColor={`${colorScheme === "light" ? Colors.light.buttonBackground : Colors.dark.buttonBackground}`}
        ios_backgroundColor={`${colorScheme === "light" ? Colors.light.buttonBackground : Colors.dark.buttonBackground}`}
      />
    </Pressable>
  );
};
