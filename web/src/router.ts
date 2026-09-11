import {
  type HskLevel,
  firstDayOfHsk,
  hskOfDay,
  lastDayOfHsk,
} from "./course";
import { renderLayout } from "./layout";
import { renderCalendar } from "./pages/calendar";
import { renderHome } from "./pages/home";
import { renderLesson } from "./pages/lesson";
import { openOnboardDialog } from "./pages/onboard";
import { renderProgress } from "./pages/progress";
import { renderWords } from "./pages/words";
import { hasProfile } from "./progress";

export type Route =
  | { name: "home"; hsk: HskLevel }
  | { name: "calendar"; hsk: HskLevel }
  | { name: "words"; hsk: HskLevel }
  | { name: "progress"; hsk: HskLevel }
  | { name: "day"; hsk: HskLevel; day: number }
  | { name: "not-found" };

function parseHsk(part: string): HskLevel | null {
  if (part === "hsk1") return 1;
  if (part === "hsk2") return 2;
  if (part === "hsk3") return 3;
  if (part === "hsk4") return 4;
  return null;
}

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, "");
  const path = raw === "" ? "/" : raw.startsWith("/") ? raw : `/${raw}`;
  const parts = path.split("/").filter(Boolean);

  if (parts.length === 0) return { name: "home", hsk: 1 };

  const prefixed = parseHsk(parts[0]);
  const rest = prefixed ? parts.slice(1) : parts;
  const fallbackHsk: HskLevel = prefixed ?? 1;

  if (rest.length === 0) return { name: "home", hsk: fallbackHsk };
  if (rest.length === 1 && rest[0] === "calendar") {
    return { name: "calendar", hsk: fallbackHsk };
  }
  if (rest.length === 1 && rest[0] === "words") {
    return { name: "words", hsk: fallbackHsk };
  }
  if (rest.length === 1 && rest[0] === "progress") {
    return { name: "progress", hsk: fallbackHsk };
  }
  if (rest.length === 2 && rest[0] === "day" && /^\d+$/.test(rest[1])) {
    const day = Number(rest[1]);
    const hsk = hskOfDay(day);
    if (day < firstDayOfHsk(hsk) || day > lastDayOfHsk(hsk)) {
      return { name: "not-found" };
    }
    return { name: "day", hsk, day };
  }

  return { name: "not-found" };
}

function ensureHash(): void {
  if (!window.location.hash || window.location.hash === "#") {
    history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#/hsk1`,
    );
  }
}

function heading(text: string): HTMLElement {
  const h1 = document.createElement("h1");
  h1.textContent = text;
  return h1;
}

function pageFor(route: Route): HTMLElement {
  switch (route.name) {
    case "home":
      return renderHome(route.hsk);
    case "calendar":
      return renderCalendar(route.hsk);
    case "words":
      return renderWords(route.hsk);
    case "progress":
      return renderProgress(route.hsk);
    case "day":
      return renderLesson(route.day);
    default:
      return heading("Không tìm thấy trang");
  }
}

export function startApp(root: HTMLElement): void {
  const render = (): void => {
    const route = parseHash(window.location.hash);
    renderLayout(root, route, pageFor(route));
  };

  const go = (hash: string): void => {
    const next = hash.startsWith("#") ? hash : `#${hash}`;
    if (window.location.hash === next) {
      render();
      return;
    }
    window.location.hash = next;
  };

  root.addEventListener("click", (event) => {
    if (hasProfile()) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href") ?? "";
    if (!href.startsWith("#")) return;
    if (parseHash(href).name !== "day") return;
    event.preventDefault();
    openOnboardDialog({ onDone: go });
  });

  ensureHash();
  window.addEventListener("hashchange", render);
  render();
}
