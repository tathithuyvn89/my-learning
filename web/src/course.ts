export const FIRST_DAY = 1;
export const LAST_DAY = 336;
export const WEEK_COUNT = 48;
export const DAYS_PER_HSK = 56;
export const WEEKS_PER_HSK = 8;
export const COURSE_TITLE = "Học tiếng Trung HSK 1–6";
export const COURSE_TAG = "336 ngày · 48 tuần";

export type HskLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const HSK_LEVELS: HskLevel[] = [1, 2, 3, 4, 5, 6];

export type AppPage = "home" | "calendar" | "words" | "progress";

export function weekOfDay(n: number): number {
  return Math.ceil(n / 7);
}

export function hskOfWeek(week: number): HskLevel {
  if (week <= WEEKS_PER_HSK) return 1;
  if (week <= WEEKS_PER_HSK * 2) return 2;
  if (week <= WEEKS_PER_HSK * 3) return 3;
  if (week <= WEEKS_PER_HSK * 4) return 4;
  if (week <= WEEKS_PER_HSK * 5) return 5;
  return 6;
}

export function hskOfDay(n: number): HskLevel {
  if (n <= DAYS_PER_HSK) return 1;
  if (n <= DAYS_PER_HSK * 2) return 2;
  if (n <= DAYS_PER_HSK * 3) return 3;
  if (n <= DAYS_PER_HSK * 4) return 4;
  if (n <= DAYS_PER_HSK * 5) return 5;
  return 6;
}

export function firstDayOfHsk(hsk: HskLevel): number {
  return (hsk - 1) * DAYS_PER_HSK + 1;
}

export function lastDayOfHsk(hsk: HskLevel): number {
  return hsk * DAYS_PER_HSK;
}

export function firstWeekOfHsk(hsk: HskLevel): number {
  return (hsk - 1) * WEEKS_PER_HSK + 1;
}

export function lastWeekOfHsk(hsk: HskLevel): number {
  return hsk * WEEKS_PER_HSK;
}

export function weeksOfHsk(hsk: HskLevel): number[] {
  const first = firstWeekOfHsk(hsk);
  const last = lastWeekOfHsk(hsk);
  return Array.from({ length: last - first + 1 }, (_, i) => first + i);
}

export function localWeekOf(week: number): number {
  return ((week - 1) % WEEKS_PER_HSK) + 1;
}

export function localDayOf(day: number): number {
  return ((day - 1) % DAYS_PER_HSK) + 1;
}

export function nextHsk(hsk: HskLevel): HskLevel | null {
  const next = (hsk + 1) as HskLevel;
  return HSK_LEVELS.includes(next) ? next : null;
}

export function courseTitleFor(hsk: HskLevel): string {
  return `Học tiếng Trung HSK ${hsk}`;
}

export function courseTagFor(): string {
  return `${DAYS_PER_HSK} ngày · ${WEEKS_PER_HSK} tuần`;
}

export function hrefPage(hsk: HskLevel, page: AppPage = "home"): string {
  if (page === "home") return `#/hsk${hsk}`;
  return `#/hsk${hsk}/${page}`;
}

export function hrefDay(day: number): string {
  return `#/hsk${hskOfDay(day)}/day/${day}`;
}

export type Track = "zh" | "en";

export type EnCourse = "it" | "iv";

export const EN_COURSES: EnCourse[] = ["it", "iv"];
export const EN_FIRST_DAY = 1;
export const EN_LAST_DAY = 30;
export const EN_WEEK_COUNT = 5;
export const EN_COURSE_TITLE = "Học tiếng Anh IT";
export const EN_COURSE_TAG = "30 ngày · nghe–nói";
export const IV_LAST_DAY = 21;
export const IV_WEEK_COUNT = 3;
export const IV_COURSE_TITLE = "Học tiếng Anh phỏng vấn";
export const IV_COURSE_TAG = "21 ngày · phỏng vấn";

export function lastEnDay(course: EnCourse = "it"): number {
  return course === "iv" ? IV_LAST_DAY : EN_LAST_DAY;
}

export function enCourseTitle(course: EnCourse = "it"): string {
  return course === "iv" ? IV_COURSE_TITLE : EN_COURSE_TITLE;
}

export function enCourseTag(course: EnCourse = "it"): string {
  return course === "iv" ? IV_COURSE_TAG : EN_COURSE_TAG;
}

export function enTrackLabel(course: EnCourse = "it"): string {
  return course === "iv" ? "Tiếng Anh phỏng vấn" : "Tiếng Anh IT";
}

export function enShortLabel(course: EnCourse = "it"): string {
  return course === "iv" ? "Phỏng vấn" : "IT";
}

export function enDoneCopy(course: EnCourse = "it"): string {
  return course === "iv"
    ? "Đã xong 21 ngày tiếng Anh phỏng vấn."
    : "Đã xong 30 ngày tiếng Anh IT.";
}

export function weekOfEnDay(n: number, course: EnCourse = "it"): number {
  if (course === "iv") {
    if (n <= 7) return 1;
    if (n <= 14) return 2;
    return 3;
  }
  if (n <= 7) return 1;
  if (n <= 14) return 2;
  if (n <= 21) return 3;
  if (n <= 28) return 4;
  return 5;
}

export function daysOfEnWeek(
  week: number,
  course: EnCourse = "it",
): [number, number] {
  if (course === "iv") {
    const start = (week - 1) * 7 + 1;
    return [start, start + 6];
  }
  if (week <= 4) {
    const start = (week - 1) * 7 + 1;
    return [start, start + 6];
  }
  return [29, 30];
}

export function weeksOfEn(course: EnCourse = "it"): number[] {
  return course === "iv" ? [1, 2, 3] : [1, 2, 3, 4, 5];
}

function enPrefix(course: EnCourse = "it"): string {
  return course === "iv" ? "#/en/iv" : "#/en";
}

export function hrefEnPage(
  page: AppPage = "home",
  course: EnCourse = "it",
): string {
  const prefix = enPrefix(course);
  if (page === "home") return prefix;
  return `${prefix}/${page}`;
}

export function hrefEnDay(day: number, course: EnCourse = "it"): string {
  return `${enPrefix(course)}/day/${day}`;
}
