export const FIRST_DAY = 1;
export const LAST_DAY = 224;
export const WEEK_COUNT = 32;
export const DAYS_PER_HSK = 56;
export const WEEKS_PER_HSK = 8;
export const COURSE_TITLE = "Học tiếng Trung HSK 1–4";
export const COURSE_TAG = "224 ngày · 32 tuần";

export type HskLevel = 1 | 2 | 3 | 4;

export const HSK_LEVELS: HskLevel[] = [1, 2, 3, 4];

export type AppPage = "home" | "calendar" | "words" | "progress";

export function weekOfDay(n: number): number {
  return Math.ceil(n / 7);
}

export function hskOfWeek(week: number): HskLevel {
  if (week <= WEEKS_PER_HSK) return 1;
  if (week <= WEEKS_PER_HSK * 2) return 2;
  if (week <= WEEKS_PER_HSK * 3) return 3;
  return 4;
}

export function hskOfDay(n: number): HskLevel {
  if (n <= DAYS_PER_HSK) return 1;
  if (n <= DAYS_PER_HSK * 2) return 2;
  if (n <= DAYS_PER_HSK * 3) return 3;
  return 4;
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
