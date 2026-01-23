import { IPreferencesItems } from "@/app/interface/preferencesItems";
import React, { useState } from "react";
import { Text, View, useColorScheme } from "react-native";
import { ToggleItem } from "../ui/toggleItem/toggleItem";
import { createStyles } from "./styles";

export const PreferencesItems: React.FC<IPreferencesItems> = ({
  preferencesItems,
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);

  const [activeItems, setActiveItems] = useState<Record<string, boolean>>({});

  const handleToggle = (id: string, value: boolean) => {
    setActiveItems((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <>
      {preferencesItems.map((item) => (
        <View key={item.id}>
          <Text style={styles.title}>{item.title}</Text>

          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}

          <ToggleItem
            id={item.id}
            value={!!activeItems[item.id]}
            onChange={(value) => handleToggle(item.id, value)}
          />
        </View>
      ))}
    </>
  );
};
