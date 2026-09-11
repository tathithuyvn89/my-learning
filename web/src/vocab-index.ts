import { loadLesson } from "./content";
import {
  FIRST_DAY,
  LAST_DAY,
  type HskLevel,
  firstWeekOfHsk,
  lastWeekOfHsk,
} from "./course";
import type { Lesson } from "./lesson";

export type VocabEntry = Lesson["vocab"][number] & {
  day: number;
  week: number;
};

export type WeekFilter = "all" | number;

export function uniqueByHan(items: VocabEntry[]): VocabEntry[] {
  const seen = new Set<string>();
  const result: VocabEntry[] = [];
  for (const item of items) {
    if (seen.has(item.han)) continue;
    seen.add(item.han);
    result.push(item);
  }
  return result;
}

export function collectVocab(): VocabEntry[] {
  const out: VocabEntry[] = [];
  for (let day = FIRST_DAY; day <= LAST_DAY; day++) {
    const lesson = loadLesson(day);
    for (const item of lesson.vocab) {
      out.push({
        han: item.han,
        pinyin: item.pinyin,
        vi: item.vi,
        example: item.example,
        day: lesson.id,
        week: lesson.week,
      });
    }
  }
  return out;
}

export function vocabForWeek(week: WeekFilter): VocabEntry[] {
  const all = collectVocab();
  if (week === "all") return uniqueByHan(all);
  return uniqueByHan(all.filter((item) => item.week === week));
}

export function vocabForHsk(hsk: HskLevel, week: WeekFilter): VocabEntry[] {
  const first = firstWeekOfHsk(hsk);
  const last = lastWeekOfHsk(hsk);
  const inLevel = collectVocab().filter(
    (item) => item.week >= first && item.week <= last,
  );
  if (week === "all") return uniqueByHan(inLevel);
  return uniqueByHan(inLevel.filter((item) => item.week === week));
}
