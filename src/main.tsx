import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App";
import { NotionHandler } from "./Data/NotionHandler";
import "./style.css";
import { dbId, token } from "./TOKEN";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//TODO: remove test code
const notion = new NotionHandler(token, dbId);
const res = await notion.getPageId('2022-08-28');
console.log(res);
if(res){
  const content = await notion.getBlockIdText(res);
  console.log(`id: ${content?.id}, text: ${content?.text}`);
}
