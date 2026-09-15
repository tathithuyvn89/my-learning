import { loadEnLesson } from "./en-content";
import { EN_FIRST_DAY, type EnCourse, lastEnDay } from "./course";
import type { EnPhrase } from "./en-lesson";

export type EnPhraseEntry = EnPhrase & {
  day: number;
  week: number;
};

export type WeekFilter = "all" | number;

export function uniqueByEn(items: EnPhraseEntry[]): EnPhraseEntry[] {
  const seen = new Set<string>();
  const result: EnPhraseEntry[] = [];
  for (const item of items) {
    const key = item.en.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

export function collectEnPhrases(course: EnCourse = "it"): EnPhraseEntry[] {
  const out: EnPhraseEntry[] = [];
  const last = lastEnDay(course);
  for (let day = EN_FIRST_DAY; day <= last; day++) {
    const lesson = loadEnLesson(day, course);
    for (const item of lesson.phrases) {
      out.push({
        ...item,
        day: lesson.id,
        week: lesson.week,
      });
    }
  }
  return out;
}

export function phrasesForWeek(
  week: WeekFilter,
  course: EnCourse = "it",
): EnPhraseEntry[] {
  const all = collectEnPhrases(course);
  if (week === "all") return uniqueByEn(all);
  return uniqueByEn(all.filter((item) => item.week === week));
}
