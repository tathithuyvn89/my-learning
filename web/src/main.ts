/// <reference types="vite/client" />
import { initAnalytics } from "./analytics";
import "./styles.css";
import { startApp } from "./router";

initAnalytics();

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("Không tìm thấy #app");
}
startApp(app);
