import { TButton } from "@/app/types/button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { X } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { createStyles } from "./styles";

export const Button: React.FC<TButton> = ({
  textStyle,
  title,
  onPress,
  disabled,
  style,
  loading,
  size = 22,
  variant = "primary",
  colorIcon,
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      style={[
        styles.buttonBg,
        variant === "outline" ? styles.buttonOutline : styles.buttonPrimary,
        disabled ? styles.disabled : {},
        loading ? styles.buttonLoading : {},
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={"white"} />
      ) : variant === "close" ? (
        <X color={colorIcon || colors.colorWhite} size={size} />
      ) : (
        <ThemedText
          style={[
            styles.text,
            variant === "outline" ? styles.textOutline : styles.textPrimary,
            textStyle,
          ]}
        >
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};
