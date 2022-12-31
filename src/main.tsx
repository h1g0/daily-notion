import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./style.css";
//import { dbId, token } from "./TOKEN";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  //Commented out because `componentDidMount` is called twice if `React.StrictMode` is enabled.
  //<React.StrictMode>
  <App />
  //</React.StrictMode>
);
