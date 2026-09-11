import {
  type AppPage,
  HSK_LEVELS,
  type HskLevel,
  courseTagFor,
  courseTitleFor,
  hrefPage,
} from "./course";
import { loadProfile } from "./progress";
import type { Route } from "./router";

const NAV: Array<{ page: AppPage; label: string; icon: string }> = [
  { page: "home", label: "Hôm nay", icon: "今" },
  { page: "calendar", label: "Lịch", icon: "历" },
  { page: "words", label: "Sổ từ", icon: "词" },
  { page: "progress", label: "Tiến độ", icon: "进" },
];

function hskOfRoute(route: Route): HskLevel {
  return route.name === "not-found" ? 1 : route.hsk;
}

function switchHref(hsk: HskLevel, route: Route): string {
  if (
    route.name === "calendar" ||
    route.name === "words" ||
    route.name === "progress"
  ) {
    return hrefPage(hsk, route.name);
  }
  return hrefPage(hsk, "home");
}

export function renderLayout(
  root: HTMLElement,
  route: Route,
  content: HTMLElement,
): void {
  const hsk = hskOfRoute(route);
  const header = document.createElement("header");
  header.className = "site-header";

  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href = hrefPage(hsk, "home");
  brand.setAttribute("aria-label", courseTitleFor(hsk));

  const mark = document.createElement("span");
  mark.className = "brand-mark";
  mark.textContent = "汉";
  mark.setAttribute("aria-hidden", "true");

  const brandText = document.createElement("span");
  brandText.className = "brand-text";
  const title = document.createElement("strong");
  title.textContent = "Học tiếng Trung";
  const tag = document.createElement("span");
  tag.className = "brand-tag";
  const profile = loadProfile();
  tag.textContent = profile ? `Xin chào, ${profile.name}` : courseTagFor();
  brandText.append(title, tag);
  brand.append(mark, brandText);

  const switcher = document.createElement("nav");
  switcher.className = "hsk-switch";
  switcher.setAttribute("aria-label", "Cấp HSK");
  for (const level of HSK_LEVELS) {
    const link = document.createElement("a");
    link.href = switchHref(level, route);
    link.textContent = `HSK ${level}`;
    if (hsk === level) link.setAttribute("aria-current", "page");
    switcher.append(link);
  }

  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.setAttribute("aria-label", "Chính");

  for (const item of NAV) {
    const link = document.createElement("a");
    link.href = hrefPage(hsk, item.page);
    const icon = document.createElement("span");
    icon.className = "nav-icon";
    icon.textContent = item.icon;
    icon.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.className = "nav-label";
    label.textContent = item.label;
    link.append(icon, label);
    if (
      route.name === item.page ||
      (item.page === "home" && route.name === "day")
    ) {
      link.setAttribute("aria-current", "page");
    }
    nav.append(link);
  }

  header.append(brand, switcher);

  const main = document.createElement("main");
  main.className = "site-main";
  main.append(content);

  root.replaceChildren(header, main, nav);
}
