import { IPreferencesItems } from "@/app/interface/preferences";
import React, { useState } from "react";
import { View, useColorScheme } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { Button } from "../ui/button";
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
    <ThemedView>
      {preferencesItems.map((item) => (
        <View style={styles.wrapperItem} key={item.id}>
          <View style={styles.item}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>

            {item.description && (
              <ThemedText style={styles.description}>
                {item.description}
              </ThemedText>
            )}
          </View>

          <View style={styles.toogleWrapper}>
            <ThemedText style={styles.textToggle}>Desativado</ThemedText>
            <ToggleItem
              id={item.id}
              value={!!activeItems[item.id]}
              onChange={(value) => handleToggle(item.id, value)}
              containerStyle={{ marginRight: 7 }}
            />
            <ThemedText style={styles.textToggle}>Ativado</ThemedText>
          </View>
        </View>
      ))}
      <ThemedView style={styles.actionsWrapper}>
        <Button variant="outline" title="Configurar mais tarde" />
        <Button title="Salvar" />
      </ThemedView>
    </ThemedView>
  );
};
