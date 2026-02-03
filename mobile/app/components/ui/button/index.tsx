import { ThemedText } from "@/app/components/themed-text";
import { Colors } from "@/app/constants/theme";
import { IButton } from "@/app/interface/buttons";
import { X } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { createStyles } from "./styles";

export const Button: React.FC<IButton> = ({
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
