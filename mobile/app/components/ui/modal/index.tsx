import { Colors } from "@/app/constants/theme";
import { IModal } from "@/app/interface/modal";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
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
        contentType === "legend" ? styles.modalContainerLegend : {},
        open ? { display: "flex" } : { display: "none" },
      ]}
    >
      {/* MODAL  */}
      {contentType !== "loading" && (
        <View style={[styles.modalContent, style]}>
          <View
            style={[
              styles.modalHeader,
              contentType === "legend" ? { marginBottom: 0 } : {},
            ]}
          >
            <Button
              style={[
                { paddingVertical: 0, paddingHorizontal: 0 },
                contentType === "legend"
                  ? {
                      backgroundColor: "transparent",
                      borderColor: "transparent",
                    }
                  : {},
              ]}
              variant="close"
              title="Fechar"
              colorIcon={contentType === "legend" ? colors.colorPrimary : ""}
              onPress={onClose}
            />
          </View>
          <View>
            <Text style={[styles.textBody]}>{children || text}</Text>
            {contentType !== "legend" && (
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
            )}
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
      <Pressable style={styles.backdrop} onPress={onClose}>
        <ThemedView></ThemedView>
      </Pressable>
      {/* backdrop */}
    </View>
  );
};
