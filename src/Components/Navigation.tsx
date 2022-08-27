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

export class Navigation extends React.Component {
  render() {
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
  }
};
