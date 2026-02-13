import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { IAccordion } from "@/app/interface/accordion";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { createStyles } from "./styles";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Accordion = ({
  title,
  children,
  style,
  headerStyle,
  initialMode = false,
}: IAccordion) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];
  const [expanded, setExpanded] = useState(initialMode);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View
      style={[styles.accordion, { borderColor: colors.colorPrimary }, style]}
    >
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.7}
        style={[styles.header, headerStyle]}
      >
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {expanded ? (
          <ChevronUp size={20} color={colors.colorPrimary} />
        ) : (
          <ChevronDown size={20} color={colors.colorPrimary} />
        )}
      </TouchableOpacity>

      {expanded && (
        <View
          style={[
            styles.content,
            { borderTopWidth: 1, borderTopColor: colors.colorPrimary },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
};
