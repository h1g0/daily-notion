import React from 'react';
import './App.css';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/datetime2/lib/css/blueprint-datetime2.css';

import { Navigation } from './Components/Navigation';
import { Notepad } from './Components/Notepad';

export class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <Notepad />
      </div>
    );
  }
}