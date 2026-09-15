import { loadEnLesson } from "../en-content";
import {
  type EnCourse,
  daysOfEnWeek,
  enTrackLabel,
  hrefEnDay,
  lastEnDay,
  weeksOfEn,
} from "../course";
import { isEnDayComplete, nextUnfinishedEnDay } from "../progress";

export function renderEnCalendar(course: EnCourse = "it"): HTMLElement {
  const section = document.createElement("section");
  section.className = "calendar-page";
  const heading = document.createElement("h1");
  const label = enTrackLabel(course);
  heading.textContent = `Lịch · ${label}`;

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

  const todayLesson = nextUnfinishedEnDay(course);
  const last = lastEnDay(course);
  const grid = document.createElement("div");
  grid.className = "calendar-grid";
  grid.setAttribute("aria-label", `${label} · ${last} ngày học`);

  for (const week of weeksOfEn(course)) {
    const [start, end] = daysOfEnWeek(week, course);
    const row = document.createElement("div");
    row.className = "cal-week";
    const weekLabel = document.createElement("p");
    weekLabel.className = "cal-week-label";
    weekLabel.textContent = `Tuần ${week}`;
    const days = document.createElement("div");
    days.className = "cal-week-days";

    for (let n = start; n <= end; n++) {
      const cell = document.createElement("a");
      cell.href = hrefEnDay(n, course);
      cell.className = "cal-cell";
      cell.textContent = String(n);
      const lesson = loadEnLesson(n, course);
      cell.setAttribute("aria-label", `Ngày ${n} — ${lesson.theme}`);
      if (isEnDayComplete(n, course)) {
        cell.classList.add("is-done");
      } else if (n === todayLesson) {
        cell.classList.add("is-today");
      } else {
        cell.classList.add("is-todo");
      }
      days.append(cell);
    }

    row.append(weekLabel, days);
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
