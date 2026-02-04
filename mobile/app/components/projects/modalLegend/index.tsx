import React from "react";

import { LegendContent } from "@/app/components/ui/legend/legendContent";
import { ModalLegend } from "@/app/components/ui/legend/modalLegend";
import { IModalLegendProjects } from "@/app/interface/modal";
export const ModalLegendProjects: React.FC<IModalLegendProjects> = ({
  onClose,
  open,
  legendContentItems,
  subtitleContentItem,
}) => {
  return (
    <ModalLegend onClose={onClose} open={open}>
      <LegendContent
        legendItems={legendContentItems}
        subtitle={subtitleContentItem}
      />
    </ModalLegend>
  );
};
