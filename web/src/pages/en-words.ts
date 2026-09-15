import {
  type EnCourse,
  enShortLabel,
  enTrackLabel,
  hrefEnDay,
  weeksOfEn,
} from "../course";
import { youglishHref } from "../en-lesson";
import { phrasesForWeek, type WeekFilter } from "../en-vocab-index";
import { listenButton } from "../speak";

function textEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text: string,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

function phraseList(week: WeekFilter, course: EnCourse): HTMLElement {
  const entries = phrasesForWeek(week, course);
  const list = document.createElement("ul");
  list.className = "vocab-list";
  const label = enShortLabel(course);
  list.setAttribute("aria-label", `Danh sách cụm tiếng Anh ${label}`);

  for (const item of entries) {
    const li = document.createElement("li");
    const source = document.createElement("a");
    source.className = "word-source";
    source.href = hrefEnDay(item.day, course);
    source.textContent = `Ngày ${item.day} · Tuần ${item.week}`;

    const actions = document.createElement("div");
    actions.className = "word-actions";
    const youglish = document.createElement("a");
    youglish.className = "youglish";
    youglish.href = youglishHref(item.en);
    youglish.target = "_blank";
    youglish.rel = "noopener noreferrer";
    youglish.textContent = "YouGlish";
    actions.append(listenButton(item.en, "en-US"), youglish, source);

    li.append(
      textEl("p", item.en, "en-line"),
      textEl("p", item.note, "note"),
      textEl("p", item.vi),
      textEl("p", `${item.example.en} · ${item.example.vi}`, "example"),
      actions,
    );
    list.append(li);
  }

  return list;
}

export function renderEnWords(course: EnCourse = "it"): HTMLElement {
  const section = document.createElement("section");
  section.className = "words-page";
  const heading = document.createElement("h1");
  const label = enTrackLabel(course);
  heading.textContent = `Sổ cụm · ${label}`;

  const count = document.createElement("p");
  count.className = "word-count";

  const filters = document.createElement("div");
  filters.className = "week-filters";
  filters.setAttribute("role", "group");
  filters.setAttribute("aria-label", "Lọc theo tuần");

  const weeks = weeksOfEn(course);
  let current: WeekFilter = "all";
  const buttons = new Map<WeekFilter, HTMLButtonElement>();
  let list = phraseList("all", course);

  function setFilter(week: WeekFilter): void {
    current = week;
    for (const [key, btn] of buttons) {
      btn.setAttribute("aria-pressed", key === current ? "true" : "false");
    }
    const next = phraseList(week, course);
    count.textContent = `${phrasesForWeek(week, course).length} cụm`;
    list.replaceWith(next);
    list = next;
  }

  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.textContent = "Tất cả";
  allBtn.addEventListener("click", () => {
    setFilter("all");
  });
  buttons.set("all", allBtn);
  filters.append(allBtn);

  for (const week of weeks) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = `Tuần ${week}`;
    btn.addEventListener("click", () => {
      setFilter(week);
    });
    buttons.set(week, btn);
    filters.append(btn);
  }

  count.textContent = `${phrasesForWeek("all", course).length} cụm`;
  allBtn.setAttribute("aria-pressed", "true");
  for (const week of weeks) {
    buttons.get(week)?.setAttribute("aria-pressed", "false");
  }

  section.append(heading, count, filters, list);
  return section;
}
