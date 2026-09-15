import {
  DAYS_PER_HSK,
  EN_FIRST_DAY,
  type EnCourse,
  FIRST_DAY,
  LAST_DAY,
  type HskLevel,
  firstDayOfHsk,
  hrefDay,
  hrefPage,
  hskOfDay,
  lastEnDay,
  localDayOf,
} from "./course";

export const PROGRESS_KEY = "hsk1-progress";
export const EN_PROGRESS_KEY = "en-it-progress";
export const EN_IV_PROGRESS_KEY = "en-iv-progress";
export const PROFILE_KEY = "hsk-profile";
export const USERS_KEY = "hsk-users";

export type Progress = {
  completedDays: number[];
  lastCompletedAt: string;
  streak: number;
};

export type Profile = {
  name: string;
  userId: string;
};

export type UserRecord = {
  name: string;
  userId: string;
  progress: Progress;
};

export type OnboardKind = "new" | "existing";

export type OnboardInput = {
  name: string;
  userId: string;
  kind: OnboardKind;
  hsk?: HskLevel;
  localDay?: number;
};

function emptyProgress(): Progress {
  return { completedDays: [], lastCompletedAt: "", streak: 0 };
}

function readRaw(key: string): string | null {
  try {
    return globalThis.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  try {
    globalThis.localStorage.setItem(key, value);
  } catch {
    // Bỏ qua nếu không có localStorage.
  }
}

export function normalizeUserId(userId: string): string {
  return userId.trim().toLowerCase();
}

function parseProgress(data: Partial<Progress> | undefined): Progress {
  if (!data) return emptyProgress();
  return {
    completedDays: Array.isArray(data.completedDays)
      ? data.completedDays.filter((n) => typeof n === "number")
      : [],
    lastCompletedAt:
      typeof data.lastCompletedAt === "string" ? data.lastCompletedAt : "",
    streak: typeof data.streak === "number" ? data.streak : 0,
  };
}

export function loadProgress(): Progress {
  const raw = readRaw(PROGRESS_KEY);
  if (!raw) return emptyProgress();
  try {
    return parseProgress(JSON.parse(raw) as Partial<Progress>);
  } catch {
    return emptyProgress();
  }
}

function loadUsers(): Record<string, UserRecord> {
  const raw = readRaw(USERS_KEY);
  if (!raw) return {};
  try {
    const data = JSON.parse(raw) as Record<string, Partial<UserRecord>>;
    const out: Record<string, UserRecord> = {};
    for (const [key, value] of Object.entries(data)) {
      if (!value || typeof value.name !== "string" || typeof value.userId !== "string") {
        continue;
      }
      const name = value.name.trim();
      const userId = value.userId.trim();
      if (!name || !userId) continue;
      out[key] = {
        name,
        userId,
        progress: parseProgress(value.progress),
      };
    }
    return out;
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, UserRecord>): void {
  writeRaw(USERS_KEY, JSON.stringify(users));
}

function syncUserIfAny(progress: Progress): void {
  const profile = loadProfile();
  if (!profile) return;
  const key = normalizeUserId(profile.userId);
  if (!key) return;
  const users = loadUsers();
  users[key] = {
    name: profile.name,
    userId: profile.userId,
    progress,
  };
  writeUsers(users);
}

export function saveProgress(progress: Progress): void {
  writeRaw(PROGRESS_KEY, JSON.stringify(progress));
  syncUserIfAny(progress);
}

export function loadProfile(): Profile | null {
  const raw = readRaw(PROFILE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<Profile>;
    if (typeof data.name !== "string" || typeof data.userId !== "string") {
      return null;
    }
    const name = data.name.trim();
    const userId = data.userId.trim();
    if (!name || !userId) return null;
    return { name, userId };
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile): void {
  writeRaw(
    PROFILE_KEY,
    JSON.stringify({
      name: profile.name.trim(),
      userId: profile.userId.trim(),
    }),
  );
}

export function hasProfile(): boolean {
  return loadProfile() !== null;
}

export function findUser(userId: string): UserRecord | null {
  const key = normalizeUserId(userId);
  if (!key) return null;
  return loadUsers()[key] ?? null;
}

export function snapshotFromProgress(progress = loadProgress()): {
  hsk: HskLevel;
  localDay: number;
} {
  if (progress.completedDays.length === 0) return { hsk: 1, localDay: 0 };
  const max = Math.max(...progress.completedDays);
  return { hsk: hskOfDay(max), localDay: localDayOf(max) };
}

export function globalDayFromLocal(hsk: HskLevel, localDay: number): number {
  if (!Number.isFinite(localDay) || localDay <= 0) {
    return Math.max(0, firstDayOfHsk(hsk) - 1);
  }
  const capped = Math.min(Math.floor(localDay), DAYS_PER_HSK);
  return firstDayOfHsk(hsk) + capped - 1;
}

export function hrefAfterOnboard(): string {
  const next = nextUnfinishedDay(FIRST_DAY, LAST_DAY);
  if (next === null) {
    const max = Math.max(1, ...loadProgress().completedDays);
    return hrefPage(hskOfDay(max), "home");
  }
  return hrefDay(next);
}

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shiftDateKey(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return dateKey(dt);
}

function keyFromIso(iso: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return dateKey(d);
}

export function currentStreak(
  progress = loadProgress(),
  now = new Date(),
): number {
  if (!progress.lastCompletedAt) return 0;
  const last = keyFromIso(progress.lastCompletedAt);
  if (!last) return 0;
  const today = dateKey(now);
  if (last === today || last === shiftDateKey(today, -1)) {
    return Math.max(progress.streak, 1);
  }
  return 0;
}

export function nextUnfinishedDay(from = FIRST_DAY, to = LAST_DAY): number | null {
  const done = new Set(loadProgress().completedDays);
  for (let n = from; n <= to; n++) {
    if (!done.has(n)) return n;
  }
  return null;
}

export function markDayComplete(day: number, now = new Date()): Progress {
  const current = loadProgress();
  const completedDays = current.completedDays.includes(day)
    ? current.completedDays
    : [...current.completedDays, day].sort((a, b) => a - b);
  const today = dateKey(now);
  const last = keyFromIso(current.lastCompletedAt);
  let streak = current.streak;
  if (!last) {
    streak = 1;
  } else if (last === today) {
    streak = Math.max(current.streak, 1);
  } else if (last === shiftDateKey(today, -1)) {
    streak = current.streak + 1;
  } else {
    streak = 1;
  }
  const next: Progress = {
    completedDays,
    lastCompletedAt: now.toISOString(),
    streak,
  };
  saveProgress(next);
  return next;
}

export function markDaysCompleteThrough(lastDay: number, now = new Date()): Progress {
  const capped = Math.max(0, Math.min(Math.floor(lastDay), LAST_DAY));
  const current = loadProgress();
  const done = new Set(current.completedDays);
  for (let n = FIRST_DAY; n <= capped; n++) done.add(n);
  const completedDays = [...done].sort((a, b) => a - b);
  const next: Progress = {
    completedDays,
    lastCompletedAt: capped > 0 ? now.toISOString() : current.lastCompletedAt,
    streak: capped > 0 ? Math.max(current.streak, 1) : current.streak,
  };
  saveProgress(next);
  return next;
}

export function completeOnboarding(
  input: OnboardInput,
  now = new Date(),
): { hash: string } {
  const name = input.name.trim();
  const userId = input.userId.trim();
  if (!name || !userId) {
    throw new Error("Thiếu tên hoặc mã học viên");
  }

  const existing = findUser(userId);
  const currentProfile = loadProfile();
  saveProfile({ name, userId: existing?.userId ?? userId });

  if (existing) {
    saveProgress(existing.progress);
  } else if (
    currentProfile &&
    normalizeUserId(currentProfile.userId) !== normalizeUserId(userId)
  ) {
    saveProgress(emptyProgress());
  } else {
    saveProgress(loadProgress());
  }

  if (input.kind === "existing") {
    const hsk = input.hsk ?? 1;
    const localDay = input.localDay ?? 0;
    markDaysCompleteThrough(globalDayFromLocal(hsk, localDay), now);
  }

  return { hash: hrefAfterOnboard() };
}

export function isDayComplete(day: number): boolean {
  return loadProgress().completedDays.includes(day);
}

function enKey(course: EnCourse = "it"): string {
  return course === "iv" ? EN_IV_PROGRESS_KEY : EN_PROGRESS_KEY;
}

export function loadEnProgress(course: EnCourse = "it"): Progress {
  const raw = readRaw(enKey(course));
  if (!raw) return emptyProgress();
  try {
    return parseProgress(JSON.parse(raw) as Partial<Progress>);
  } catch {
    return emptyProgress();
  }
}

export function saveEnProgress(
  progress: Progress,
  course: EnCourse = "it",
): void {
  writeRaw(enKey(course), JSON.stringify(progress));
}

export function isEnDayComplete(
  day: number,
  course: EnCourse = "it",
): boolean {
  return loadEnProgress(course).completedDays.includes(day);
}

export function nextUnfinishedEnDay(course: EnCourse = "it"): number | null {
  const done = new Set(loadEnProgress(course).completedDays);
  const last = lastEnDay(course);
  for (let n = EN_FIRST_DAY; n <= last; n++) {
    if (!done.has(n)) return n;
  }
  return null;
}

export function currentEnStreak(
  now = new Date(),
  course: EnCourse = "it",
): number {
  return currentStreak(loadEnProgress(course), now);
}

export function markEnDayComplete(
  day: number,
  now = new Date(),
  course: EnCourse = "it",
): Progress {
  const current = loadEnProgress(course);
  const completedDays = current.completedDays.includes(day)
    ? current.completedDays
    : [...current.completedDays, day].sort((a, b) => a - b);
  const today = dateKey(now);
  const last = keyFromIso(current.lastCompletedAt);
  let streak = current.streak;
  if (!last) {
    streak = 1;
  } else if (last === today) {
    streak = Math.max(current.streak, 1);
  } else if (last === shiftDateKey(today, -1)) {
    streak = current.streak + 1;
  } else {
    streak = 1;
  }
  const next: Progress = {
    completedDays,
    lastCompletedAt: now.toISOString(),
    streak,
  };
  saveEnProgress(next, course);
  return next;
}
