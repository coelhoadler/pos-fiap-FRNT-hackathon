import { Colors } from "@/app/constants/theme";
import { IFormErrorMessage } from "@/app/interface/errorMessages/forms";
import React from "react";
import { Text, useColorScheme, View } from "react-native";
import { createStyles } from "./styles";

export const FormErrorMessage: React.FC<IFormErrorMessage> = ({
  message,
  style,
  styleText,
  ...props
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.formErrorMessage, style]}>
      <Text style={[styles.textFormError, styleText]}>{message}</Text>
    </View>
  );
};
