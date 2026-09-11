/// <reference types="vite/client" />
import "./styles.css";
import { startApp } from "./router";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("Không tìm thấy #app");
}
startApp(app);
