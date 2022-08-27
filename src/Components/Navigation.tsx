import React from "react";
import {
  Alignment,
  AnchorButton,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
} from "@blueprintjs/core";
import { DateSelector } from "./DateSelector";

export interface NavigationProps { }

export const Navigation: React.FC<NavigationProps> = () => {
  return (
    <Navbar className={Classes.DARK}>
      <NavbarGroup align={Alignment.LEFT}>
        <AnchorButton icon='menu' />
        <NavbarDivider />
        <DateSelector />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <AnchorButton icon='send-message' />
      </NavbarGroup>
    </Navbar>
  );
};
