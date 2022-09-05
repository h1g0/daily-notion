import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./style.css";
import { dbId, token } from "./TOKEN";

localStorage.setItem('token', token);
localStorage.setItem('dbId', dbId);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  //Commented out because `componentDidMount` is called twice if `React.StrictMode` is enabled.
  //<React.StrictMode>
  <App />
  //</React.StrictMode>
);
