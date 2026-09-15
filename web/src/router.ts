import { trackPageView } from "./analytics";
import {
  type EnCourse,
  type HskLevel,
  type Track,
  firstDayOfHsk,
  hskOfDay,
  lastDayOfHsk,
  lastEnDay,
  EN_FIRST_DAY,
} from "./course";
import { renderLayout } from "./layout";
import { renderCalendar } from "./pages/calendar";
import { renderEnCalendar } from "./pages/en-calendar";
import { renderEnHome } from "./pages/en-home";
import { renderEnLesson } from "./pages/en-lesson";
import { renderEnProgress } from "./pages/en-progress";
import { renderEnWords } from "./pages/en-words";
import { renderHome } from "./pages/home";
import { renderLesson } from "./pages/lesson";
import { openOnboardDialog } from "./pages/onboard";
import { renderProgress } from "./pages/progress";
import { renderWords } from "./pages/words";
import { hasProfile } from "./progress";

export type Route =
  | { name: "home"; track: "zh"; hsk: HskLevel }
  | { name: "calendar"; track: "zh"; hsk: HskLevel }
  | { name: "words"; track: "zh"; hsk: HskLevel }
  | { name: "progress"; track: "zh"; hsk: HskLevel }
  | { name: "day"; track: "zh"; hsk: HskLevel; day: number }
  | { name: "home"; track: "en"; course: EnCourse }
  | { name: "calendar"; track: "en"; course: EnCourse }
  | { name: "words"; track: "en"; course: EnCourse }
  | { name: "progress"; track: "en"; course: EnCourse }
  | { name: "day"; track: "en"; course: EnCourse; day: number }
  | { name: "not-found" };

function parseHsk(part: string): HskLevel | null {
  if (part === "hsk1") return 1;
  if (part === "hsk2") return 2;
  if (part === "hsk3") return 3;
  if (part === "hsk4") return 4;
  if (part === "hsk5") return 5;
  if (part === "hsk6") return 6;
  return null;
}

function zhPage(
  name: "home" | "calendar" | "words" | "progress",
  hsk: HskLevel,
): Route {
  return { name, track: "zh", hsk };
}

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, "");
  const path = raw === "" ? "/" : raw.startsWith("/") ? raw : `/${raw}`;
  const parts = path.split("/").filter(Boolean);

  if (parts.length === 0) return { name: "home", track: "zh", hsk: 1 };

  if (parts[0] === "en") {
    const course: EnCourse = parts[1] === "iv" ? "iv" : "it";
    const rest = course === "iv" ? parts.slice(2) : parts.slice(1);
    const last = lastEnDay(course);
    if (rest.length === 0) return { name: "home", track: "en", course };
    if (rest.length === 1 && rest[0] === "calendar") {
      return { name: "calendar", track: "en", course };
    }
    if (rest.length === 1 && rest[0] === "words") {
      return { name: "words", track: "en", course };
    }
    if (rest.length === 1 && rest[0] === "progress") {
      return { name: "progress", track: "en", course };
    }
    if (rest.length === 2 && rest[0] === "day" && /^\d+$/.test(rest[1])) {
      const day = Number(rest[1]);
      if (day < EN_FIRST_DAY || day > last) return { name: "not-found" };
      return { name: "day", track: "en", course, day };
    }
    return { name: "not-found" };
  }

  const prefixed = parseHsk(parts[0]);
  const rest = prefixed ? parts.slice(1) : parts;
  const fallbackHsk: HskLevel = prefixed ?? 1;

  if (rest.length === 0) return zhPage("home", fallbackHsk);
  if (rest.length === 1 && rest[0] === "calendar") {
    return zhPage("calendar", fallbackHsk);
  }
  if (rest.length === 1 && rest[0] === "words") {
    return zhPage("words", fallbackHsk);
  }
  if (rest.length === 1 && rest[0] === "progress") {
    return zhPage("progress", fallbackHsk);
  }
  if (rest.length === 2 && rest[0] === "day" && /^\d+$/.test(rest[1])) {
    const day = Number(rest[1]);
    const hsk = hskOfDay(day);
    if (day < firstDayOfHsk(hsk) || day > lastDayOfHsk(hsk)) {
      return { name: "not-found" };
    }
    return { name: "day", track: "zh", hsk, day };
  }

  return { name: "not-found" };
}

export function trackOfRoute(route: Route): Track {
  if (route.name === "not-found") return "zh";
  return route.track;
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
      return route.track === "en"
        ? renderEnHome(route.course)
        : renderHome(route.hsk);
    case "calendar":
      return route.track === "en"
        ? renderEnCalendar(route.course)
        : renderCalendar(route.hsk);
    case "words":
      return route.track === "en"
        ? renderEnWords(route.course)
        : renderWords(route.hsk);
    case "progress":
      return route.track === "en"
        ? renderEnProgress(route.course)
        : renderProgress(route.hsk);
    case "day":
      return route.track === "en"
        ? renderEnLesson(route.day, route.course)
        : renderLesson(route.day);
    default:
      return heading("Không tìm thấy trang");
  }
}

export function startApp(root: HTMLElement): void {
  const render = (): void => {
    const route = parseHash(window.location.hash);
    renderLayout(root, route, pageFor(route));
    trackPageView();
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
    openOnboardDialog({ onDone: go, preferHash: href });
  });

  ensureHash();
  window.addEventListener("hashchange", render);
  render();
}
