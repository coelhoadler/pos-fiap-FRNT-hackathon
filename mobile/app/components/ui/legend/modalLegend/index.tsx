import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { IModalLegend } from "@/app/interface/modal";
import React from "react";
import { Text, View } from "react-native";

import { Modal } from "../../modal";
import { createStyles } from "./styles";

export const ModalLegend: React.FC<IModalLegend> = ({
  onClose,
  open,
  style,
  children,
}) => {
  const colorScheme = useColorScheme() === "light" ? "light" : "dark";
  const styles = createStyles(colorScheme);
  const colors = Colors[colorScheme];

  return (
    <Modal
      style={[styles.modalLegendWrapper, style]}
      onClose={onClose}
      open={open}
      contentType={"legend"}
    >
      <View>
        <Text style={styles.title}>Legenda</Text>
        <View style={styles.itemsWrapper}>{children}</View>
      </View>
    </Modal>
  );
};
