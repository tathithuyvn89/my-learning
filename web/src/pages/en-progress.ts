import { loadEnLesson } from "../en-content";
import {
  type EnCourse,
  daysOfEnWeek,
  enTrackLabel,
  hrefEnDay,
  lastEnDay,
  weeksOfEn,
} from "../course";
import {
  currentEnStreak,
  isEnDayComplete,
  loadEnProgress,
  nextUnfinishedEnDay,
} from "../progress";

export function renderEnProgress(course: EnCourse = "it"): HTMLElement {
  const section = document.createElement("section");
  section.className = "progress-page";

  const heading = document.createElement("h1");
  const label = enTrackLabel(course);
  heading.textContent = `Tiến độ · ${label}`;

  const last = lastEnDay(course);
  const doneCount = loadEnProgress(course).completedDays.filter(
    (n) => n >= 1 && n <= last,
  ).length;
  const streak = currentEnStreak(new Date(), course);
  const pct = Math.round((doneCount / last) * 100);

  const stats = document.createElement("div");
  stats.className = "stat-grid";
  stats.append(
    statCard(String(streak), "Chuỗi ngày"),
    statCard(`${doneCount}/${last}`, "Bài đã xong"),
    statCard(`${pct}%`, "Hoàn thành"),
  );

  const track = document.createElement("div");
  track.className = "progress-track";
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", String(last));
  track.setAttribute("aria-valuenow", String(doneCount));
  track.setAttribute("aria-label", `Tiến độ ${label.toLowerCase()}`);
  const fill = document.createElement("div");
  fill.className = "progress-fill";
  fill.style.width = `${pct}%`;
  track.append(fill);

  const weeks = document.createElement("ol");
  weeks.className = "week-progress";
  weeks.setAttribute("aria-label", `Tiến độ theo tuần ${label.toLowerCase()}`);
  for (const week of weeksOfEn(course)) {
    const [start, end] = daysOfEnWeek(week, course);
    const total = end - start + 1;
    let nDone = 0;
    for (let d = start; d <= end; d++) {
      if (isEnDayComplete(d, course)) nDone += 1;
    }
    const li = document.createElement("li");
    const weekLabel = document.createElement("span");
    weekLabel.textContent = `Tuần ${week}`;
    const weekTrack = document.createElement("div");
    weekTrack.className = "progress-track is-compact";
    const weekFill = document.createElement("div");
    weekFill.className = "progress-fill";
    weekFill.style.width = `${Math.round((nDone / total) * 100)}%`;
    weekTrack.append(weekFill);
    const count = document.createElement("span");
    count.className = "week-done";
    count.textContent = `${nDone}/${total}`;
    li.append(weekLabel, weekTrack, count);
    weeks.append(li);
  }

  const nextId = nextUnfinishedEnDay(course);
  const cta = document.createElement("a");
  cta.className = "cta";
  if (nextId === null) {
    cta.href = hrefEnDay(1, course);
    cta.textContent = "Xem lại ngày 1";
  } else {
    const lesson = loadEnLesson(nextId, course);
    cta.href = hrefEnDay(nextId, course);
    cta.textContent = `Tiếp: Ngày ${nextId} — ${lesson.theme}`;
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
