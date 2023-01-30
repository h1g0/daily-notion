import { Classes } from "@blueprintjs/core";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { App } from "./App";
import { Auth } from "./Auth";
import { PreferencesHandler } from "./Data/PreferencesHandler";
import "./style.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  //<React.StrictMode>
  <RouterProvider router={router} />
  //</React.StrictMode>
);
if (PreferencesHandler.getColorMode() === 'dark') {
  (document.getElementById("root") as HTMLElement).classList.add(Classes.DARK);
}
