import React from "react";

import { LegendContent } from "@/app/components/ui/legend/legendContent";
import { ModalLegend } from "@/app/components/ui/legend/modalLegend";
import { IModalLegendTasks } from "@/app/interface/modal";
import { ScrollView } from "react-native";
export const ModalLegendTasks: React.FC<IModalLegendTasks> = ({
  onClose,
  open,
  legendContentItems,
  subtitleContentItem,
}) => {
  return (
    <ModalLegend onClose={onClose} open={open}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        style={{ maxHeight: 400 }}
      >
        <LegendContent
          legendItems={legendContentItems}
          subtitle={subtitleContentItem}
        />
      </ScrollView>
    </ModalLegend>
  );
};
