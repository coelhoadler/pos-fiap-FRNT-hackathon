import { Colors } from "@/app/constants/theme";
import { IIconButton } from "@/app/interface/buttons";
import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { createStyles } from "./styles";

export const IconButton: React.FC<IIconButton> = ({
  onPress,
  disabled,
  style,
  loading,
  icon,
  colorIcon,
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      style={[style]}
      onPress={onPress ? onPress : () => {}}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={colorIcon || colors.colorPrimary} />
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
};
