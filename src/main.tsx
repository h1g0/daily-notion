import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App";
import { NotionHandler } from "./Data/NotionHandler";
import "./style.css";
import { dbId, token } from "./TOKEN";
import { format } from "date-fns";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//TODO: remove test code
const notion = new NotionHandler(token, dbId);
const res = await notion.getPageId('2022-08-28','2022-08-28');
console.log(res);
if(res.isOk && res.pageId){
  const content = await notion.getBlockIdText(res.pageId);
  if(content.isOk && content.id){
    console.log(`id: ${content.id}, text: ${content.text}`);
    const update = await notion.updateParagraphBlockByText(content.id, content.text + `\n${(new Date()).toISOString()}`);
    console.log(JSON.stringify(update));
  }
}
const todayStr = format(new Date(), 'yyyy-MM-dd');
const createRes = await notion.createPage(todayStr, todayStr);
if(createRes.isOk && createRes.pageId){
  const createBlockRes = await notion.createParagraphBlock(createRes.pageId, (new Date()).toISOString());
}

