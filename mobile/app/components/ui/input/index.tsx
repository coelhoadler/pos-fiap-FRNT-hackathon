import { Colors } from "@/app/constants/theme";
import { IInput } from "@/app/interface/input";
import { genericFormStyles } from "@/app/styles/genericFormStyles";
import React from "react";
import { Text, TextInput, useColorScheme, View } from "react-native";
import { createStyles } from "./styles";

export const Input: React.FC<IInput> = ({
  text,
  id,
  style,
  type = "text",
  value,
  ...props
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  return (
    <View style={[genericFormStyles(colorScheme).defaultItemWrapper, style]}>
      <Text style={genericFormStyles(colorScheme).defaultLabel}>{text}</Text>
      <TextInput
        style={genericFormStyles(colorScheme).defaultItem}
        value={value}
        secureTextEntry={type === "password"}
        keyboardType={
          type === "numeric"
            ? "numeric"
            : type === "email"
              ? "email-address"
              : "default"
        }
        placeholderTextColor={colors.colorTertiary}
        {...props}
      />
    </View>
  );
};
