import { Colors } from "@/app/constants/theme";
import { IAddContentButton } from "@/app/interface/addContentButton";
import { CirclePlus } from "lucide-react-native";
import React from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { createStyles } from "./styles";

export const AddContentButton: React.FC<IAddContentButton> = ({
  onPress,
  children,
  style,
  text,
  ...props
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.contentWrapper, style]}>
      <Pressable onPress={onPress}>
        <View style={styles.addContentButton}>
          <CirclePlus size={22} color={colors.text} />
          <Text style={styles.textContent}>{text || children}</Text>
        </View>
      </Pressable>
    </View>
  );
};
