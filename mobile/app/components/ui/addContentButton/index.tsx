import { Colors } from "@/app/constants/theme";
import { IAddContentButton } from "@/app/interface/addContentButton";
import { CirclePlus, Eye } from "lucide-react-native";
import React from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { createStyles } from "./styles";

export const AddContentButton: React.FC<IAddContentButton> = ({
  onPress,
  children,
  style,
  styleText,
  text,
  size = 22,
  colorIcon,
  typeIcon = "add",
  noIcon,
  ...props
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.contentWrapper, style]}>
      <Pressable onPress={onPress}>
        <View style={styles.addContentButton}>
          {!noIcon && (
            <>
              {typeIcon === "add" && (
                <CirclePlus
                  size={size}
                  color={colorIcon ? colorIcon : colors.text}
                />
              )}
              {typeIcon === "view" && (
                <Eye size={size} color={colorIcon ? colorIcon : colors.text} />
              )}
            </>
          )}
          <Text style={[styles.textContent, styleText]}>
            {text || children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
