import { Colors } from "@/app/constants/theme";
import { IModal } from "@/app/interface/modal";
import React from "react";
import { ActivityIndicator, Text, useColorScheme, View } from "react-native";
import { ThemedView } from "../../themed-view";
import { Button } from "../button";
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
  textButtonActionA = "Não",
  textButtonActionB = "Sim",
  textButton = "OK",
  textLoading = "Salvando...",
  sizeLoading = 30,
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.modalContainer,
        open ? { display: "flex" } : { display: "none" },
      ]}
    >
      {/* MODAL  */}
      {contentType !== "loading" && (
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
                  title={textButton}
                  onPress={onClose}
                />
              ) : (
                <>
                  <Button
                    textStyle={styles.buttonModalTextOutline}
                    style={styles.buttonModalOutline}
                    variant="outline"
                    title={textButtonActionA}
                    onPress={onPressActionA}
                  />
                  <Button
                    textStyle={styles.buttonModalText}
                    style={styles.buttonModal}
                    variant="outline"
                    title={textButtonActionB}
                    onPress={onPressActionB}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      )}
      {/* MODAL  */}

      {/* MODAL LOADING  */}
      {contentType === "loading" && (
        <View style={styles.loadingContent}>
          <ActivityIndicator size={sizeLoading} color={colors.colorPrimary} />
          {textLoading && <Text style={styles.loadingText}>{textLoading}</Text>}
        </View>
      )}
      {/* MODAL LOADING  */}

      {/* backdrop */}
      <ThemedView style={styles.backdrop}></ThemedView>
      {/* backdrop */}
    </View>
  );
};
