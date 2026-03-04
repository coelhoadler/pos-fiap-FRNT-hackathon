import { Colors } from "@/app/constants/theme";
import { ICardHome } from "@/app/interface/home";
import React from "react";
import { Text, useColorScheme, View } from "react-native";
import { Button } from "../ui/button";
import { createStyles } from "./styles";

export const CardHome: React.FC<ICardHome> = ({
  title,
  description,
  icon,
  onPressView,
  textButton,
  style,
  ...props
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.card, style]} accessible={true}>
      <View style={styles.cardHeader}>
        {icon && icon}
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {description && <Text style={styles.cardDescription}>{description}</Text>}
      {onPressView && (
        <View style={styles.cardFooter}>
          <Button title={textButton || "Saiba mais"} onPress={onPressView} />
        </View>
      )}
    </View>
  );
};
