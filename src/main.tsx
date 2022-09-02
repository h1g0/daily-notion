import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./style.css";
import { dbId, token } from "./TOKEN";

localStorage.setItem('token', token);
localStorage.setItem('dbId', dbId);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  //<React.StrictMode> //Commented out because `componentDidMount` is called twice if `React.StrictMode` is enabled.
    <App />
  //</React.StrictMode>
);
