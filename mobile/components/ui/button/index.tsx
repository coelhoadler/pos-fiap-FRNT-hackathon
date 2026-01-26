import { TButton } from "@/app/types/button";
import { ThemedText } from "@/components/themed-text";
import React from "react";
import { ActivityIndicator, Pressable, useColorScheme } from "react-native";
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
    <Pressable onPress={onPress} disabled={disabled || loading}>
      <Pressable
        style={[
          styles.buttonBg,
          variant === "outline" ? styles.buttonOutline : styles.buttonPrimary,
          disabled ? styles.disabled : {},
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={`${variant === "outline" ? "white" : "#0a7ea4"} `}
          />
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
      </Pressable>
    </Pressable>
  );
};
