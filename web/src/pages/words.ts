import {
  type HskLevel,
  hrefDay,
  localDayOf,
  localWeekOf,
  weeksOfHsk,
} from "../course";
import { listenButton } from "../speak";
import { youglishHref } from "../youglish";
import { vocabForHsk, type WeekFilter } from "../vocab-index";

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

function wordList(hsk: HskLevel, week: WeekFilter): HTMLElement {
  const entries = vocabForHsk(hsk, week);
  const list = document.createElement("ul");
  list.className = "vocab-list";
  list.setAttribute("aria-label", `Danh sách từ HSK ${hsk}`);

  for (const item of entries) {
    const li = document.createElement("li");
    const source = document.createElement("a");
    source.className = "word-source";
    source.href = hrefDay(item.day);
    source.textContent = `Ngày ${localDayOf(item.day)} · Tuần ${localWeekOf(item.week)}`;

    const actions = document.createElement("div");
    actions.className = "word-actions";
    const youglish = document.createElement("a");
    youglish.className = "youglish";
    youglish.href = youglishHref(item.han, "chinese");
    youglish.target = "_blank";
    youglish.rel = "noopener noreferrer";
    youglish.textContent = "YouGlish";
    actions.append(listenButton(item.han), youglish, source);

    li.append(
      textEl("p", item.han, "han"),
      textEl("p", item.pinyin, "pinyin"),
      textEl("p", item.vi),
      textEl(
        "p",
        `${item.example.han} · ${item.example.pinyin} · ${item.example.vi}`,
        "example",
      ),
      actions,
    );
    list.append(li);
  }

  return list;
}

export function renderWords(hsk: HskLevel): HTMLElement {
  const section = document.createElement("section");
  section.className = "words-page";
  const heading = document.createElement("h1");
  heading.textContent = `Sổ từ · HSK ${hsk}`;

  const count = document.createElement("p");
  count.className = "word-count";

  const filters = document.createElement("div");
  filters.className = "week-filters";
  filters.setAttribute("role", "group");
  filters.setAttribute("aria-label", "Lọc theo tuần");

  const weeks = weeksOfHsk(hsk);
  let current: WeekFilter = "all";
  const buttons = new Map<WeekFilter, HTMLButtonElement>();
  let list = wordList(hsk, "all");

  function setFilter(week: WeekFilter): void {
    current = week;
    for (const [key, btn] of buttons) {
      btn.setAttribute("aria-pressed", key === current ? "true" : "false");
    }
    const next = wordList(hsk, week);
    count.textContent = `${vocabForHsk(hsk, week).length} từ`;
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
    btn.textContent = `Tuần ${localWeekOf(week)}`;
    btn.addEventListener("click", () => {
      setFilter(week);
    });
    buttons.set(week, btn);
    filters.append(btn);
  }

  count.textContent = `${vocabForHsk(hsk, "all").length} từ`;
  allBtn.setAttribute("aria-pressed", "true");
  for (const week of weeks) {
    buttons.get(week)?.setAttribute("aria-pressed", "false");
  }

  section.append(heading, count, filters, list);
  return section;
}
