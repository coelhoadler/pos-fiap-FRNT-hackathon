import { IPreferencesItems } from "@/app/interface/preferences";
import {
  PreferencesFlags,
  getPreferences,
  savePreferences,
} from "@/app/services/preferences";
import React, { useEffect, useState } from "react";
import { ScrollView, View, useColorScheme } from "react-native";
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

  const [activeItems, setActiveItems] = useState<PreferencesFlags>({});

  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    async function loadPreferences() {
      try {
        const savedPreferences = await getPreferences();

        if (savedPreferences) {
          setActiveItems(savedPreferences);
        }
      } catch (error) {
        console.error("Erro ao carregar preferências:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, []);

  const handleToggle = (id: string, value: boolean) => {
    setActiveItems((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const buildFullPreferencesObject = () => {
    const result: Record<string, boolean> = {};

    preferencesItems.forEach((item) => {
      result[item.id] = activeItems[item.id] ?? false;
    });

    return result;
  };

  const handlePreferencesSave = async () => {
    try {
      setLoading(true);
      setSuccessMessage(false);
      const fullPreferences = buildFullPreferencesObject();

      await savePreferences(fullPreferences);

      console.log("Preferências salvas com sucesso!", fullPreferences);
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      setLoading(false);
    } finally {
      setLoading(false);
      setSuccessMessage(true);
    }
  };

  return (
    <ThemedView>
      {successMessage ? (
        <View>
          <ThemedText>Preferências salvas com sucesso!</ThemedText>
          <Button title="Ok" onPress={() => setSuccessMessage(false)} />
        </View>
      ) : (
        <>
          <ScrollView style={{ width: "100%" }}>
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
          </ScrollView>

          <ThemedView style={styles.actionsWrapper}>
            <Button variant="outline" title="Configurar mais tarde" />
            <Button
              loading={loading}
              title="Salvar"
              onPress={handlePreferencesSave}
            />
          </ThemedView>
        </>
      )}
    </ThemedView>
  );
};
