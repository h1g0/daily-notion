import { Classes } from "@blueprintjs/core";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { App } from "./App";
import { Auth } from "./Auth";
import "./style.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App  className={Classes.DARK}/>,
  },
  {
    path: "/auth",
    element: <Auth  className={Classes.DARK}/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  //<React.StrictMode>
    <RouterProvider router={router} />
  //</React.StrictMode>
);
