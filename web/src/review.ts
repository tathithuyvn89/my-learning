import { loadLesson } from "./content";
import { firstDayOfHsk, hskOfDay, localDayOf, localWeekOf } from "./course";
import { uniqueByHan, type VocabEntry } from "./vocab-index";

const MIN_WORDS = 5;
const MAX_WORDS = 8;

export type ReviewSet = {
  words: VocabEntry[];
  label: string;
};

function vocabOfDays(days: number[]): VocabEntry[] {
  const out: VocabEntry[] = [];
  for (const day of days) {
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
  return uniqueByHan(out);
}

function daysBeforeInWeek(day: number, week: number): number[] {
  const ids: number[] = [];
  for (let n = 1; n < day; n++) {
    if (loadLesson(n).week === week) ids.push(n);
  }
  return ids;
}

function pickReview(items: VocabEntry[]): VocabEntry[] {
  if (items.length <= MAX_WORDS) return items;
  const picked: VocabEntry[] = [];
  const used = new Set<number>();
  for (let i = 0; i < MAX_WORDS; i++) {
    const idx = Math.round((i * (items.length - 1)) / (MAX_WORDS - 1));
    if (used.has(idx)) continue;
    used.add(idx);
    picked.push(items[idx]);
  }
  for (let i = 0; i < items.length && picked.length < MAX_WORDS; i++) {
    if (used.has(i)) continue;
    used.add(i);
    picked.push(items[i]);
  }
  return picked;
}

export function reviewForDay(day: number): ReviewSet {
  const first = firstDayOfHsk(hskOfDay(day));
  if (day <= first) return { words: [], label: "" };

  const lesson = loadLesson(day);
  if (lesson.kind === "review") {
    const localWeek = localWeekOf(lesson.week);
    let source = daysBeforeInWeek(day, lesson.week);
    let words = vocabOfDays(source);
    if (words.length < MIN_WORDS && localWeek > 1) {
      source = [
        ...daysBeforeInWeek(day, lesson.week - 1),
        ...daysBeforeInWeek(day, lesson.week),
      ];
      words = vocabOfDays(source);
    }
    const weekLabel =
      source.some((n) => loadLesson(n).week !== lesson.week)
        ? `Từ tuần ${localWeekOf(lesson.week - 1)}–${localWeek}`
        : `Từ tuần ${localWeek}`;
    return { words: pickReview(words), label: weekLabel };
  }

  const yesterday = vocabOfDays([day - 1]);
  return {
    words: pickReview(yesterday),
    label: `Từ ngày ${localDayOf(day - 1)}`,
  };
}
