import {
  type AppPage,
  EN_COURSES,
  type EnCourse,
  HSK_LEVELS,
  type HskLevel,
  courseTagFor,
  courseTitleFor,
  enCourseTag,
  enCourseTitle,
  hrefEnPage,
  hrefPage,
} from "./course";
import { loadProfile } from "./progress";
import type { Route } from "./router";
import { applySeo } from "./seo";

const NAV: Array<{ page: AppPage; label: string; icon: string }> = [
  { page: "home", label: "Hôm nay", icon: "今" },
  { page: "calendar", label: "Lịch", icon: "历" },
  { page: "words", label: "Sổ từ", icon: "词" },
  { page: "progress", label: "Tiến độ", icon: "进" },
];

const EN_NAV: Array<{ page: AppPage; label: string; icon: string }> = [
  { page: "home", label: "Hôm nay", icon: "To" },
  { page: "calendar", label: "Lịch", icon: "Cal" },
  { page: "words", label: "Sổ cụm", icon: "Ph" },
  { page: "progress", label: "Tiến độ", icon: "Go" },
];

function trackOf(route: Route): "zh" | "en" {
  if (route.name === "not-found") return "zh";
  return route.track;
}

function hskOfRoute(route: Route): HskLevel {
  if (route.name === "not-found" || route.track === "en") return 1;
  return route.hsk;
}

function pageOfRoute(route: Route): AppPage {
  if (route.name === "calendar" || route.name === "words" || route.name === "progress") {
    return route.name;
  }
  return "home";
}

function courseOf(route: Route): EnCourse {
  if (route.name === "not-found" || route.track === "zh") return "it";
  return route.course;
}

function zhHref(hsk: HskLevel, route: Route): string {
  return hrefPage(hsk, pageOfRoute(route));
}

function labeled(title: string, sub: string): HTMLElement {
  const wrap = document.createElement("span");
  wrap.className = "track-text";
  const strong = document.createElement("strong");
  strong.textContent = title;
  const span = document.createElement("span");
  span.textContent = sub;
  wrap.append(strong, span);
  return wrap;
}

function pageHref(route: Route, page: AppPage): string {
  if (trackOf(route) === "en") return hrefEnPage(page, courseOf(route));
  return hrefPage(hskOfRoute(route), page);
}

function brandBlock(route: Route): HTMLAnchorElement {
  const track = trackOf(route);
  const hsk = hskOfRoute(route);
  const course = courseOf(route);
  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href =
    track === "en" ? hrefEnPage("home", course) : hrefPage(hsk, "home");
  brand.setAttribute(
    "aria-label",
    track === "en" ? enCourseTitle(course) : courseTitleFor(hsk),
  );

  const mark = document.createElement("span");
  mark.className = "brand-mark";
  mark.textContent = track === "en" ? "En" : "汉";
  mark.setAttribute("aria-hidden", "true");

  const brandText = document.createElement("span");
  brandText.className = "brand-text";
  const title = document.createElement("strong");
  title.textContent = track === "en" ? enCourseTitle(course) : "Học tiếng Trung";
  const tag = document.createElement("span");
  tag.className = "brand-tag";
  const profile = loadProfile();
  tag.textContent = profile
    ? `Xin chào, ${profile.name}`
    : track === "en"
      ? enCourseTag(course)
      : courseTagFor();
  brandText.append(title, tag);
  brand.append(mark, brandText);
  return brand;
}

function trackCaret(): HTMLElement {
  const caret = document.createElement("span");
  caret.className = "track-caret";
  caret.setAttribute("aria-hidden", "true");
  return caret;
}

function trackSummary(
  markText: string,
  markClass: string,
  title: string,
  sub: string,
  current: boolean,
): HTMLElement {
  const summary = document.createElement("summary");
  summary.className = "track-item";
  if (current) summary.setAttribute("aria-current", "page");
  const mark = document.createElement("span");
  mark.className = markClass;
  mark.textContent = markText;
  mark.setAttribute("aria-hidden", "true");
  summary.append(mark, labeled(title, sub), trackCaret());
  return summary;
}

function trackGroup(
  open: boolean,
  summary: HTMLElement,
  children: HTMLElement[],
): HTMLElement {
  const group = document.createElement("details");
  group.className = "track-group";
  group.open = open;
  const sub = document.createElement("div");
  sub.className = "track-sub";
  sub.append(...children);
  group.append(summary, sub);
  return group;
}

function courseRail(route: Route): HTMLElement {
  const track = trackOf(route);
  const hsk = hskOfRoute(route);
  const course = courseOf(route);
  const aside = document.createElement("aside");
  aside.className = "course-rail";
  aside.id = "course-rail";
  aside.setAttribute("aria-label", "Khóa học");

  const railBrand = brandBlock(route);
  railBrand.classList.add("brand-rail");

  const tracks = document.createElement("nav");
  tracks.className = "track-nav";
  tracks.setAttribute("aria-label", "Trung hoặc Anh");

  const hskLinks: HTMLElement[] = [];
  for (const level of HSK_LEVELS) {
    const link = document.createElement("a");
    link.href = zhHref(level, route);
    link.textContent = `HSK ${level}`;
    if (track === "zh" && hsk === level) {
      link.setAttribute("aria-current", "page");
    }
    hskLinks.push(link);
  }

  const enLabels: Record<EnCourse, string> = { it: "IT", iv: "Phỏng vấn" };
  const enLinks: HTMLElement[] = [];
  for (const item of EN_COURSES) {
    const link = document.createElement("a");
    link.href = hrefEnPage(pageOfRoute(route), item);
    link.textContent = enLabels[item];
    if (track === "en" && course === item) {
      link.setAttribute("aria-current", "page");
    }
    enLinks.push(link);
  }

  const zhGroup = trackGroup(
    track === "zh",
    trackSummary("汉", "track-mark", "Trung", "HSK 1–6", track === "zh"),
    hskLinks,
  );
  const enGroup = trackGroup(
    track === "en",
    trackSummary("En", "track-mark is-en", "Anh", "IT + phỏng vấn", track === "en"),
    enLinks,
  );

  tracks.append(zhGroup, enGroup);
  aside.append(railBrand, tracks);
  return aside;
}

let drawerAbort: AbortController | null = null;

function bindDrawer(root: HTMLElement, toggle: HTMLButtonElement): void {
  const rail = root.querySelector<HTMLElement>(".course-rail");
  const backdrop = root.querySelector<HTMLElement>(".rail-backdrop");
  if (!rail || !backdrop) return;

  drawerAbort?.abort();
  drawerAbort = new AbortController();
  const { signal } = drawerAbort;

  const setOpen = (open: boolean): void => {
    rail.classList.toggle("is-open", open);
    backdrop.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("rail-open", open);
    const desktop = window.matchMedia("(min-width: 900px)").matches;
    if (desktop) {
      rail.removeAttribute("aria-hidden");
      rail.inert = false;
    } else {
      rail.setAttribute("aria-hidden", open ? "false" : "true");
      rail.inert = !open;
    }
  };

  setOpen(false);
  toggle.addEventListener("click", () => {
    setOpen(!rail.classList.contains("is-open"));
  }, { signal });
  backdrop.addEventListener("click", () => setOpen(false), { signal });
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") setOpen(false);
    },
    { signal },
  );
}

function bindTrackGroups(root: HTMLElement): void {
  const groups = [
    ...root.querySelectorAll<HTMLDetailsElement>(".track-group"),
  ];
  for (const group of groups) {
    group.addEventListener(
      "toggle",
      () => {
        if (!group.open) return;
        for (const other of groups) {
          if (other !== group) other.open = false;
        }
      },
      { signal: drawerAbort?.signal },
    );
  }
}

export function renderLayout(
  root: HTMLElement,
  route: Route,
  content: HTMLElement,
): void {
  const track = trackOf(route);
  const course = courseOf(route);
  applySeo(route);
  root.classList.toggle("is-en", track === "en");

  const header = document.createElement("header");
  header.className = "site-header";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "rail-toggle";
  toggle.setAttribute("aria-controls", "course-rail");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Mở menu khóa học");

  const toggleMark = document.createElement("span");
  toggleMark.className = track === "en" ? "rail-toggle-mark is-en" : "rail-toggle-mark";
  toggleMark.textContent = track === "en" ? "En" : "汉";
  toggleMark.setAttribute("aria-hidden", "true");
  const toggleLabel = document.createElement("span");
  toggleLabel.className = "rail-toggle-label";
  toggleLabel.textContent =
    track === "en" ? enCourseTitle(course) : "Học tiếng Trung";
  const toggleCaret = document.createElement("span");
  toggleCaret.className = "rail-toggle-caret";
  toggleCaret.setAttribute("aria-hidden", "true");
  toggle.append(toggleMark, toggleLabel, toggleCaret);

  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.setAttribute("aria-label", "Chính");
  const items = track === "en" ? EN_NAV : NAV;

  for (const item of items) {
    const link = document.createElement("a");
    link.href = pageHref(route, item.page);
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

  header.append(toggle, nav);

  const main = document.createElement("main");
  main.className = "site-main";
  main.append(content);

  const backdrop = document.createElement("div");
  backdrop.className = "rail-backdrop";
  backdrop.hidden = true;
  backdrop.setAttribute("aria-hidden", "true");

  const shell = document.createElement("div");
  shell.className = "app-shell";
  shell.append(header, main);

  root.replaceChildren(courseRail(route), shell, backdrop);
  bindDrawer(root, toggle);
  bindTrackGroups(root);
}
