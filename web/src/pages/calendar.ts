import {
  type HskLevel,
  firstDayOfHsk,
  hrefDay,
  lastDayOfHsk,
  localDayOf,
  localWeekOf,
  weeksOfHsk,
} from "../course";
import { isDayComplete, nextUnfinishedDay } from "../progress";

export function renderCalendar(hsk: HskLevel): HTMLElement {
  const section = document.createElement("section");
  section.className = "calendar-page";
  const heading = document.createElement("h1");
  heading.textContent = `Lịch · HSK ${hsk}`;

  const legend = document.createElement("div");
  legend.className = "cal-legend";
  legend.append(
    chip("Xong", "is-done"),
    chip("Bài tiếp", "is-today"),
    chip("Chưa học", "is-todo"),
  );

  const hint = document.createElement("p");
  hint.className = "cal-hint";
  hint.textContent = "Bấm ngày để vào bài.";

  const first = firstDayOfHsk(hsk);
  const last = lastDayOfHsk(hsk);
  const todayLesson = nextUnfinishedDay(first, last);
  const grid = document.createElement("div");
  grid.className = "calendar-grid";
  grid.setAttribute("aria-label", `HSK ${hsk} · ${last - first + 1} ngày học`);

  for (const week of weeksOfHsk(hsk)) {
    const row = document.createElement("div");
    row.className = "cal-week";
    const label = document.createElement("p");
    label.className = "cal-week-label";
    label.textContent = `Tuần ${localWeekOf(week)}`;
    const days = document.createElement("div");
    days.className = "cal-week-days";

    const start = (week - 1) * 7 + 1;
    for (let n = start; n < start + 7; n++) {
      const cell = document.createElement("a");
      cell.href = hrefDay(n);
      cell.className = "cal-cell";
      const local = localDayOf(n);
      cell.textContent = String(local);
      cell.setAttribute("aria-label", `Ngày ${local}`);
      if (isDayComplete(n)) {
        cell.classList.add("is-done");
      } else if (n === todayLesson) {
        cell.classList.add("is-today");
      } else {
        cell.classList.add("is-todo");
      }
      days.append(cell);
    }

    row.append(label, days);
    grid.append(row);
  }

  section.append(heading, legend, hint, grid);
  return section;
}

function chip(text: string, kind: string): HTMLElement {
  const el = document.createElement("span");
  el.className = `cal-chip ${kind}`;
  el.textContent = text;
  return el;
}
