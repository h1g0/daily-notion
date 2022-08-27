import React from 'react';
import './App.css';
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