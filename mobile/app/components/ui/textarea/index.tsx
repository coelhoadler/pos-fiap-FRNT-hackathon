import { Colors } from "@/app/constants/theme";

import { ITextArea } from "@/app/interface/textarea";
import { genericFormStyles } from "@/app/styles/genericFormStyles";
import React from "react";
import { Text, TextInput, useColorScheme, View } from "react-native";
import { createStyles } from "./styles";

export const TextArea: React.FC<ITextArea> = ({
  text,
  id,
  style,
  value,
  numberOfLines = 4,
  ...props
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  return (
    <View style={[genericFormStyles(colorScheme).defaultItemWrapper, style]}>
      <Text style={genericFormStyles(colorScheme).defaultLabel}>{text}</Text>
      <TextInput
        style={[
          genericFormStyles(colorScheme).defaultItem,
          styles.customTextArea,
        ]}
        value={value}
        multiline={true}
        numberOfLines={numberOfLines}
        placeholderTextColor={colors.colorTertiary}
        {...props}
      />
    </View>
  );
};
