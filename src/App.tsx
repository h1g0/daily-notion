import { Button, EditableText, TextArea } from '@blueprintjs/core';
import { WidgetButton } from '@blueprintjs/icons/lib/esm/generated/16px/paths';
import './App.css';
import { Navigation } from './Components/Navigation';
import { Notepad } from './Components/Notepad';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Notepad />
    </div>
  );
}

export default App;
