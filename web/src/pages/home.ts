import { loadLesson } from "../content";
import {
  type HskLevel,
  firstDayOfHsk,
  hrefDay,
  hrefPage,
  lastDayOfHsk,
  localDayOf,
  localWeekOf,
  nextHsk,
  weeksOfHsk,
} from "../course";
import {
  currentStreak,
  isDayComplete,
  loadProfile,
  nextUnfinishedDay,
} from "../progress";

export function renderHome(hsk: HskLevel): HTMLElement {
  const section = document.createElement("section");
  section.className = "home";
  const heading = document.createElement("h1");
  heading.textContent = `Hôm nay · HSK ${hsk}`;

  const profile = loadProfile();
  const hello = document.createElement("p");
  hello.className = "home-hello";
  if (profile) {
    hello.textContent = `Xin chào, ${profile.name}.`;
  } else {
    hello.textContent = "Bấm bắt đầu để nhập tên và mã học viên.";
  }

  const streak = currentStreak();
  const first = firstDayOfHsk(hsk);
  const last = lastDayOfHsk(hsk);
  const nextId = nextUnfinishedDay(first, last);

  const hero = document.createElement("article");
  hero.className = "hero";

  const streakLine = document.createElement("p");
  streakLine.className = "streak";
  streakLine.textContent =
    streak > 0 ? `Chuỗi ${streak} ngày` : "Chưa có chuỗi ngày";

  const theme = document.createElement("p");
  theme.className = "hero-theme";
  const start = document.createElement("a");
  start.className = "cta";
  if (nextId === null) {
    const nextLevel = nextHsk(hsk);
    if (nextLevel) {
      theme.textContent = `Đã xong HSK ${hsk}.`;
      start.href = hrefPage(nextLevel, "home");
      start.textContent = `Sang HSK ${nextLevel}`;
    } else {
      theme.textContent = `Đã xong các bài HSK ${hsk}.`;
      start.href = hrefDay(first);
      start.textContent = `Xem lại ngày ${localDayOf(first)}`;
    }
  } else {
    const nextLesson = loadLesson(nextId);
    theme.textContent = `Bài tiếp theo: Ngày ${localDayOf(nextId)} — ${nextLesson.theme}`;
    start.href = hrefDay(nextId);
    start.textContent = "Bắt đầu 30 phút";
  }

  hero.append(streakLine, theme, start);

  const weeks = document.createElement("div");
  weeks.className = "week-stack";
  weeks.setAttribute("aria-label", `Danh sách bài HSK ${hsk}`);

  for (const week of weeksOfHsk(hsk)) {
    const startDay = (week - 1) * 7 + 1;
    const endDay = week * 7;
    const block = document.createElement("details");
    block.className = "week-block";
    const hasNext = nextId !== null && nextId >= startDay && nextId <= endDay;
    block.open = hasNext || (nextId === null && week === weeksOfHsk(hsk)[0]);

    let weekDone = 0;
    for (let n = startDay; n <= endDay; n++) {
      if (isDayComplete(n)) weekDone += 1;
    }
    const summary = document.createElement("summary");
    summary.textContent = `Tuần ${localWeekOf(week)} · ${weekDone}/7`;
    const list = document.createElement("ul");
    list.className = "day-list";

    for (let n = startDay; n <= endDay; n++) {
      const lesson = loadLesson(n);
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = hrefDay(n);
      const local = localDayOf(n);
      link.textContent = `Ngày ${local} — ${lesson.theme}`;
      if (isDayComplete(n)) {
        li.classList.add("is-done");
        link.textContent = `Ngày ${local} — ${lesson.theme} · xong`;
      }
      if (n === nextId) li.classList.add("is-next");
      li.append(link);
      list.append(li);
    }

    block.append(summary, list);
    weeks.append(block);
  }

  section.append(heading, hello, hero, weeks);
  return section;
}
