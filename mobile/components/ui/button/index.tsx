import { TButton } from "@/app/types/button";
import { ThemedText } from "@/components/themed-text";
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
  variant = "primary",
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);

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
