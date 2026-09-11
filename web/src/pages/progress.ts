import { loadLesson } from "../content";
import {
  DAYS_PER_HSK,
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
  loadProgress,
  nextUnfinishedDay,
} from "../progress";

export function renderProgress(hsk: HskLevel): HTMLElement {
  const section = document.createElement("section");
  section.className = "progress-page";

  const heading = document.createElement("h1");
  heading.textContent = `Tiến độ · HSK ${hsk}`;

  const first = firstDayOfHsk(hsk);
  const last = lastDayOfHsk(hsk);
  const doneCount = loadProgress().completedDays.filter(
    (n) => n >= first && n <= last,
  ).length;
  const streak = currentStreak();
  const pct = Math.round((doneCount / DAYS_PER_HSK) * 100);

  const stats = document.createElement("div");
  stats.className = "stat-grid";
  stats.append(
    statCard(String(streak), "Chuỗi ngày"),
    statCard(`${doneCount}/${DAYS_PER_HSK}`, "Bài đã xong"),
    statCard(`${pct}%`, "Hoàn thành"),
  );

  const track = document.createElement("div");
  track.className = "progress-track";
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", String(DAYS_PER_HSK));
  track.setAttribute("aria-valuenow", String(doneCount));
  track.setAttribute("aria-label", `Tiến độ HSK ${hsk}`);
  const fill = document.createElement("div");
  fill.className = "progress-fill";
  fill.style.width = `${pct}%`;
  track.append(fill);

  const weeks = document.createElement("ol");
  weeks.className = "week-progress";
  weeks.setAttribute("aria-label", `Tiến độ theo tuần HSK ${hsk}`);
  for (const week of weeksOfHsk(hsk)) {
    const start = (week - 1) * 7 + 1;
    const end = week * 7;
    let nDone = 0;
    for (let d = start; d <= end; d++) {
      if (isDayComplete(d)) nDone += 1;
    }
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = `Tuần ${localWeekOf(week)}`;
    const weekTrack = document.createElement("div");
    weekTrack.className = "progress-track is-compact";
    const weekFill = document.createElement("div");
    weekFill.className = "progress-fill";
    weekFill.style.width = `${Math.round((nDone / 7) * 100)}%`;
    weekTrack.append(weekFill);
    const count = document.createElement("span");
    count.className = "week-done";
    count.textContent = `${nDone}/7`;
    li.append(label, weekTrack, count);
    weeks.append(li);
  }

  const nextId = nextUnfinishedDay(first, last);
  const cta = document.createElement("a");
  cta.className = "cta";
  if (nextId === null) {
    const nextLevel = nextHsk(hsk);
    if (nextLevel) {
      cta.href = hrefPage(nextLevel, "home");
      cta.textContent = `Sang HSK ${nextLevel}`;
    } else {
      cta.href = hrefDay(first);
      cta.textContent = `Xem lại ngày ${localDayOf(first)}`;
    }
  } else {
    const lesson = loadLesson(nextId);
    cta.href = hrefDay(nextId);
    cta.textContent = `Tiếp: Ngày ${localDayOf(nextId)} — ${lesson.theme}`;
  }

  section.append(heading, stats, track, weeks, cta);
  return section;
}

function statCard(value: string, label: string): HTMLElement {
  const article = document.createElement("article");
  article.className = "stat-card";
  const v = document.createElement("p");
  v.className = "stat-value";
  v.textContent = value;
  const l = document.createElement("p");
  l.className = "stat-label";
  l.textContent = label;
  article.append(v, l);
  return article;
}
