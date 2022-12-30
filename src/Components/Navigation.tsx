import React from "react";
import {
  Alignment,
  AnchorButton,
  IconName,
  Classes,
  Intent,
  Navbar,
  NavbarDivider,
  NavbarGroup,
} from "@blueprintjs/core";
import { DateSelector } from "./DateSelector";
import { SyncStatus } from "../App";

export class Navigation extends React.Component<{ onDateChange: (dateValue: Date) => void , syncStatus: SyncStatus}> {
  render() {
    let icon : IconName = 'updated';
    let intent : Intent = 'success';
    let loading = true;
    if(this.props.syncStatus === 'Uploading' || this.props.syncStatus === 'Downloading'){
      loading = true;
      intent = 'none';
    }else if(this.props.syncStatus === 'OK'){
      loading = false;
      icon = 'updated';
      intent = 'success';
    }else{
      loading = true;
      icon = 'error';
      intent = 'danger';
    }
    return (
      <Navbar className={Classes.DARK}>
        <NavbarGroup align={Alignment.LEFT}>
          <AnchorButton icon='menu' />
          <NavbarDivider />
          <DateSelector onDateChange={this.handleDateChange}/>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <AnchorButton minimal icon= {icon} loading={loading} intent={intent}/>
        </NavbarGroup>
      </Navbar>
    );
  }

  handleDateChange = (dateValue: Date) => {
    this.props.onDateChange(dateValue);
  }
};
