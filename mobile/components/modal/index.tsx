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
  contentType = "feedbackMessage",
  onPressActionA,
  onPressActionB,
  textButtonActionA,
  textButtonActionB,
  textButton,
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
          <Text style={[styles.textBody]}>{children || text}</Text>
          <View
            style={[
              styles.modalActionsButtons,
              contentType === "feedbackMessage"
                ? ""
                : contentType === "withActions"
                  ? styles.modalActionsButtonsTwoOptions
                  : {},
            ]}
          >
            {contentType === "feedbackMessage" ? (
              <Button
                textStyle={styles.buttonModalTextOutline}
                style={styles.buttonModalOutline}
                variant="outline"
                title={"OK"}
                onPress={onClose}
              />
            ) : (
              <>
                <Button
                  textStyle={styles.buttonModalTextOutline}
                  style={styles.buttonModalOutline}
                  variant="outline"
                  title={textButtonActionA || "Não"}
                  onPress={onPressActionA}
                />
                <Button
                  textStyle={styles.buttonModalText}
                  style={styles.buttonModal}
                  variant="outline"
                  title={textButtonActionB || "Sim"}
                  onPress={onPressActionB}
                />
              </>
            )}
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
