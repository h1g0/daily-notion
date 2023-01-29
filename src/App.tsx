import React from 'react';
import './App.css';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/datetime2/lib/css/blueprint-datetime2.css';
import { format } from "date-fns";

import { Navigation } from './Components/Navigation';
import { Notepad } from './Components/Notepad';
import { Classes } from '@blueprintjs/core';

export class App extends React.Component<any, { dateStr: string, syncStatus: SyncStatus }> {
  constructor(props: any) {
    super(props);
    this.state = {
      dateStr: format(new Date(), 'yyyy-MM-dd'),
      syncStatus: 'OK',
    };
  }

  render() {
    return (
      <div className={"App"}>
        <Navigation onDateChange={this.handleDateChange} syncStatus={this.state.syncStatus}/>
        <Notepad dateStr={this.state.dateStr} onChangeStatus={this.handleSyncStatusChange}/>
      </div>
    );
  }

  handleDateChange = (dateValue: Date) => {
    this.setState({ dateStr: format(dateValue, 'yyyy-MM-dd') });
    window.console.debug(`Date changed: ${this.state.dateStr}`);
  }

  handleSyncStatusChange = (status: SyncStatus) =>{
    this.setState({syncStatus : status});
  }
}

export type SyncStatus = 'OK' | 'Error' | 'Uploading' | 'Downloading';