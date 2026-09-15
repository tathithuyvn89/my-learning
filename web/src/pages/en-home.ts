import { loadEnLesson } from "../en-content";
import {
  type EnCourse,
  daysOfEnWeek,
  enDoneCopy,
  enTrackLabel,
  hrefEnDay,
  weeksOfEn,
} from "../course";
import {
  currentEnStreak,
  isEnDayComplete,
  loadProfile,
  nextUnfinishedEnDay,
} from "../progress";

export function renderEnHome(course: EnCourse = "it"): HTMLElement {
  const section = document.createElement("section");
  section.className = "home";
  const heading = document.createElement("h1");
  const label = enTrackLabel(course);
  heading.textContent = `Hôm nay · ${label}`;

  const profile = loadProfile();
  const hello = document.createElement("p");
  hello.className = "home-hello";
  hello.textContent = profile
    ? `Xin chào, ${profile.name}.`
    : "Bấm bắt đầu để nhập tên và mã học viên.";

  const streak = currentEnStreak(new Date(), course);
  const nextId = nextUnfinishedEnDay(course);

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
    theme.textContent = enDoneCopy(course);
    start.href = hrefEnDay(1, course);
    start.textContent = "Xem lại ngày 1";
  } else {
    const nextLesson = loadEnLesson(nextId, course);
    theme.textContent = `Bài tiếp theo: Ngày ${nextId} — ${nextLesson.theme}`;
    start.href = hrefEnDay(nextId, course);
    start.textContent = "Bắt đầu 30 phút";
  }

  hero.append(streakLine, theme, start);

  const weeks = document.createElement("div");
  weeks.className = "week-stack";
  weeks.setAttribute("aria-label", `Danh sách bài ${label}`);

  for (const week of weeksOfEn(course)) {
    const [startDay, endDay] = daysOfEnWeek(week, course);
    const total = endDay - startDay + 1;
    const block = document.createElement("details");
    block.className = "week-block";
    const hasNext =
      nextId !== null && nextId >= startDay && nextId <= endDay;
    block.open = hasNext || (nextId === null && week === 1);

    let weekDone = 0;
    for (let n = startDay; n <= endDay; n++) {
      if (isEnDayComplete(n, course)) weekDone += 1;
    }
    const summary = document.createElement("summary");
    summary.textContent = `Tuần ${week} · ${weekDone}/${total}`;
    const list = document.createElement("ul");
    list.className = "day-list";

    for (let n = startDay; n <= endDay; n++) {
      const lesson = loadEnLesson(n, course);
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = hrefEnDay(n, course);
      link.textContent = `Ngày ${n} — ${lesson.theme}`;
      if (isEnDayComplete(n, course)) {
        li.classList.add("is-done");
        link.textContent = `Ngày ${n} — ${lesson.theme} · xong`;
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
