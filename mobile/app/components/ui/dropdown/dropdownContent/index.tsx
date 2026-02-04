import { Colors } from "@/app/constants/theme";
import { IDropdownContent } from "@/app/interface/dropdown";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { createStyles } from "./styles";

export const DropdownContent: React.FC<IDropdownContent> = ({
  style,
  dropdownItems,
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.dropdownWrapper, style]}>
      {dropdownItems?.map((item, index) => {
        const isLastItem = index === dropdownItems.length - 1;

        return (
          <View key={item.id}>
            <TouchableOpacity
              onPress={item.onPress}
              style={[
                styles.dropdownItemWrapper,
                isLastItem && { borderBottomWidth: 0, paddingBottom: 4 },
              ]}
            >
              {item.icon && item.icon}
              <Text style={styles.dropdownItem}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};
