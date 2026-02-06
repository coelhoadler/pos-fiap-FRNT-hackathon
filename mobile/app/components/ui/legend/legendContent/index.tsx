import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { ILegendContent } from "@/app/interface/modal";
import React from "react";
import { Text, View } from "react-native";
import { createStyles } from "./styles";

export const LegendContent: React.FC<ILegendContent> = ({
  legendItems,
  style,
  subtitle,
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.legendContent, style]}>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {legendItems && (
        <>
          {legendItems?.map((item, index) => (
            <View style={styles.wrapperItem} key={index}>
              {item.icon && (
                <View style={[styles.wrapperIcon, item.styleLegendIcon]}>
                  {item.icon}
                </View>
              )}
              <Text style={styles.descriptionItem}>{item.description}</Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
};
