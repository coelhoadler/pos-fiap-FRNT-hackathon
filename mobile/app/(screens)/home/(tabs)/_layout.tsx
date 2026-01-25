import React from "react";
import { MenuProvider } from "../menu-context";
import { LayoutWithMenu } from "./layout-with-menu";

export default function TabLayout() {
  return (
    <MenuProvider>
      <LayoutWithMenu />
    </MenuProvider>
  );
}
