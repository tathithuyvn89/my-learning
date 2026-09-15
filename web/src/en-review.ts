import { loadEnLesson } from "./en-content";
import { uniqueByEn, type EnPhraseEntry } from "./en-vocab-index";
import type { EnCourse } from "./course";

const MIN = 4;
const MAX = 6;
const REPAIR_DAY = 10;
const REPAIR_ENS = ["Could you repeat that?", "What I heard is…"];

export type EnReviewSet = {
  phrases: EnPhraseEntry[];
  label: string;
};

function phrasesOfDays(
  days: number[],
  course: EnCourse,
): EnPhraseEntry[] {
  const out: EnPhraseEntry[] = [];
  for (const day of days) {
    const lesson = loadEnLesson(day, course);
    for (const item of lesson.phrases) {
      out.push({
        ...item,
        day: lesson.id,
        week: lesson.week,
      });
    }
  }
  return uniqueByEn(out);
}

function daysBeforeInWeek(
  day: number,
  week: number,
  course: EnCourse,
): number[] {
  const ids: number[] = [];
  for (let n = 1; n < day; n++) {
    if (loadEnLesson(n, course).week === week) ids.push(n);
  }
  return ids;
}

function pick(items: EnPhraseEntry[]): EnPhraseEntry[] {
  if (items.length <= MAX) return items;
  const picked: EnPhraseEntry[] = [];
  const used = new Set<number>();
  for (let i = 0; i < MAX; i++) {
    const idx = Math.round((i * (items.length - 1)) / (MAX - 1));
    if (used.has(idx)) continue;
    used.add(idx);
    picked.push(items[idx]);
  }
  for (let i = 0; i < items.length && picked.length < MAX; i++) {
    if (used.has(i)) continue;
    used.add(i);
    picked.push(items[i]);
  }
  return picked;
}

function repairPhrases(): EnPhraseEntry[] {
  const lesson = loadEnLesson(REPAIR_DAY);
  return lesson.phrases
    .filter((item) => REPAIR_ENS.includes(item.en))
    .map((item) => ({
      ...item,
      day: lesson.id,
      week: lesson.week,
    }));
}

function withRepairNet(
  day: number,
  set: EnReviewSet,
  course: EnCourse,
): EnReviewSet {
  if (course !== "it" || day <= REPAIR_DAY) return set;
  const repairs = repairPhrases();
  if (repairs.length === 0) return set;
  const rest = set.phrases.filter((item) => !REPAIR_ENS.includes(item.en));
  return {
    phrases: uniqueByEn([...repairs, ...rest]).slice(0, MAX),
    label: set.label,
  };
}

export function reviewForEnDay(
  day: number,
  course: EnCourse = "it",
): EnReviewSet {
  if (day <= 1) return { phrases: [], label: "" };

  const lesson = loadEnLesson(day, course);
  if (lesson.kind === "review") {
    let source = daysBeforeInWeek(day, lesson.week, course);
    let phrases = phrasesOfDays(source, course);
    if (phrases.length < MIN && lesson.week > 1) {
      source = [
        ...daysBeforeInWeek(day, lesson.week - 1, course),
        ...daysBeforeInWeek(day, lesson.week, course),
      ];
      phrases = phrasesOfDays(source, course);
    }
    const mixed = source.some(
      (n) => loadEnLesson(n, course).week !== lesson.week,
    );
    const label = mixed
      ? `Từ tuần ${lesson.week - 1}–${lesson.week}`
      : `Từ tuần ${lesson.week}`;
    return withRepairNet(day, { phrases: pick(phrases), label }, course);
  }

  return withRepairNet(
    day,
    {
      phrases: pick(phrasesOfDays([day - 1], course)),
      label: `Từ ngày ${day - 1}`,
    },
    course,
  );
}
