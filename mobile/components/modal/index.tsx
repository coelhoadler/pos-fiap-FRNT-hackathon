import { IModal } from "@/app/interface/modal";
import React from "react";
import { Text, useColorScheme, View } from "react-native";
import { ThemedView } from "../themed-view";
import { Button } from "../ui/button";
import { createStyles } from "./styles";

export const Modal: React.FC<IModal> = ({
  children,
  text,
  onClose,
  open = true,
  style,
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);

  return (
    <View
      style={[
        styles.modalContainer,
        open ? { display: "flex" } : { display: "none" },
      ]}
    >
      {/* MODAL  */}
      <View style={[styles.modalContent, style]}>
        <View style={styles.modalHeader}>
          <Button
            style={[
              {
                paddingVertical: 0,
                paddingHorizontal: 0,
              },
            ]}
            variant="close"
            title="Fechar"
            onPress={onClose}
          />
        </View>
        <View>
          <Text style={styles.textBody}>{children || text}</Text>
          <View style={styles.modalActionsButtons}>
            <Button
              textStyle={styles.buttonModalText}
              style={styles.buttonModal}
              variant="outline"
              title="OK"
              onPress={onClose}
            />
          </View>
        </View>
      </View>
      {/* MODAL  */}

      {/* backdrop */}
      <ThemedView style={styles.backdrop}></ThemedView>
      {/* backdrop */}
    </View>
  );
};
