import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadLesson, parseLesson } from "./content";

const day1Path = join(
  dirname(fileURLToPath(import.meta.url)),
  "../content/days/001.json",
);

describe("loadLesson", () => {
  it("returns day 1", () => {
    const lesson = loadLesson(1);
    expect(lesson.id).toBe(1);
    expect(lesson.week).toBe(1);
    expect(lesson.theme).toBe("Chào hỏi");
    expect(lesson.kind).toBe("learn");
    expect(lesson.vocab.length).toBeGreaterThanOrEqual(5);
    expect(lesson.dialogue.length).toBeGreaterThanOrEqual(4);
    expect(lesson.timer).toEqual({
      review: 5,
      vocab: 8,
      grammar: 8,
      talk: 5,
      ai: 4,
    });
  });

  it("loads days 1–7 with valid schema", () => {
    for (let n = 1; n <= 7; n++) {
      const lesson = loadLesson(n);
      expect(lesson.id).toBe(n);
      expect(lesson.week).toBe(1);
      expect(lesson.dialogue.length).toBeGreaterThanOrEqual(4);
    }
    expect(loadLesson(6).kind).toBe("review");
    expect(loadLesson(7).kind).toBe("review");
  });

  it("loads days 8–28 with valid schema", () => {
    const weekOf = (n: number) => (n <= 14 ? 2 : n <= 21 ? 3 : 4);
    const reviewDays = new Set([13, 14, 20, 21, 27, 28]);
    for (let n = 8; n <= 28; n++) {
      const lesson = loadLesson(n);
      expect(lesson.id).toBe(n);
      expect(lesson.week).toBe(weekOf(n));
      expect(lesson.hsk).toBe(1);
      expect(lesson.vocab.length).toBeGreaterThanOrEqual(4);
      expect(lesson.dialogue.length).toBeGreaterThanOrEqual(4);
      expect(lesson.timer).toEqual({
        review: 5,
        vocab: 8,
        grammar: 8,
        talk: 5,
        ai: 4,
      });
      expect(lesson.kind).toBe(reviewDays.has(n) ? "review" : "learn");
    }
    expect(loadLesson(8).theme).toBe("Số 1–10");
    expect(loadLesson(15).theme).toBe("Có / không có");
    expect(loadLesson(22).theme).toBe("Ăn uống");
  });

  it("loads days 29–56 with valid schema", () => {
    const weekOf = (n: number) => {
      if (n <= 35) return 5;
      if (n <= 42) return 6;
      if (n <= 49) return 7;
      return 8;
    };
    const reviewDays = new Set([
      34, 35, 41, 42, 48, 49, 50, 51, 52, 53, 54, 55, 56,
    ]);
    for (let n = 29; n <= 56; n++) {
      const lesson = loadLesson(n);
      expect(lesson.id).toBe(n);
      expect(lesson.week).toBe(weekOf(n));
      expect(lesson.hsk).toBe(1);
      expect(lesson.vocab.length).toBeGreaterThanOrEqual(4);
      expect(lesson.dialogue.length).toBeGreaterThanOrEqual(4);
      expect(lesson.timer).toEqual({
        review: 5,
        vocab: 8,
        grammar: 8,
        talk: 5,
        ai: 4,
      });
      expect(lesson.kind).toBe(reviewDays.has(n) ? "review" : "learn");
    }
    expect(loadLesson(29).theme).toBe("Mua");
    expect(loadLesson(36).theme).toBe("Ở đâu");
    expect(loadLesson(43).theme).toBe("Thời tiết");
    expect(loadLesson(56).theme).toBe("Ngày đầu ở Bắc Kinh");
  });

  it("locks week 8 to known words (~150)", () => {
    const allowed = new Set(loadLesson(49).aiPrompt.allowedWords);
    expect(allowed.size).toBeGreaterThanOrEqual(140);
    expect(allowed.size).toBeLessThanOrEqual(180);
    for (let n = 50; n <= 56; n++) {
      const lesson = loadLesson(n);
      expect(lesson.kind).toBe("review");
      expect(lesson.week).toBe(8);
      expect(lesson.aiPrompt.allowedWords.length).toBe(allowed.size);
      for (const item of lesson.vocab) {
        expect(allowed.has(item.han)).toBe(true);
      }
    }
  });

  it("loads days 57–112 with valid HSK 2 schema", () => {
    const weekOf = (n: number) => Math.ceil(n / 7);
    const reviewDays = new Set([
      62, 63, 69, 70, 76, 77, 83, 84, 90, 91, 97, 98, 104, 105, 106, 107, 108,
      109, 110, 111, 112,
    ]);
    for (let n = 57; n <= 112; n++) {
      const lesson = loadLesson(n);
      expect(lesson.id).toBe(n);
      expect(lesson.week).toBe(weekOf(n));
      expect(lesson.hsk).toBe(2);
      expect(lesson.vocab.length).toBeGreaterThanOrEqual(4);
      expect(lesson.dialogue.length).toBeGreaterThanOrEqual(4);
      expect(lesson.timer).toEqual({
        review: 5,
        vocab: 8,
        grammar: 8,
        talk: 5,
        ai: 4,
      });
      expect(lesson.kind).toBe(reviewDays.has(n) ? "review" : "learn");
    }
    expect(loadLesson(57).theme).toBe("Thức và ngủ");
    expect(loadLesson(64).theme).toBe("Cơ thể");
    expect(loadLesson(71).theme).toBe("Xe cộ");
    expect(loadLesson(112).theme).toBe("Ngày đầu đi làm ở Bắc Kinh");
  });

  it("locks week 16 to words known by week 15", () => {
    const allowed = new Set(loadLesson(105).aiPrompt.allowedWords);
    expect(allowed.size).toBeGreaterThanOrEqual(250);
    for (let n = 106; n <= 112; n++) {
      const lesson = loadLesson(n);
      expect(lesson.kind).toBe("review");
      expect(lesson.week).toBe(16);
      expect(lesson.aiPrompt.allowedWords.length).toBe(allowed.size);
      for (const item of lesson.vocab) {
        expect(allowed.has(item.han)).toBe(true);
      }
    }
  });

  it("loads days 113–168 with valid HSK 3 schema", () => {
    const weekOf = (n: number) => Math.ceil(n / 7);
    const reviewDays = new Set([
      118, 119, 125, 126, 132, 133, 139, 140, 146, 147, 153, 154, 160, 161, 162,
      163, 164, 165, 166, 167, 168,
    ]);
    for (let n = 113; n <= 168; n++) {
      const lesson = loadLesson(n);
      expect(lesson.id).toBe(n);
      expect(lesson.week).toBe(weekOf(n));
      expect(lesson.hsk).toBe(3);
      expect(lesson.vocab.length).toBeGreaterThanOrEqual(4);
      expect(lesson.dialogue.length).toBeGreaterThanOrEqual(4);
      expect(lesson.timer).toEqual({
        review: 5,
        vocab: 8,
        grammar: 8,
        talk: 5,
        ai: 4,
      });
      expect(lesson.kind).toBe(reviewDays.has(n) ? "review" : "learn");
    }
    expect(loadLesson(113).theme).toBe("Vừa mới / trước đây");
    expect(loadLesson(120).theme).toBe("Lo lắng");
    expect(loadLesson(127).theme).toBe("Thành phố");
    expect(loadLesson(168).theme).toBe("Ngày đầu du học ở Bắc Kinh");
  });

  it("locks week 24 to words known by week 23", () => {
    const allowed = new Set(loadLesson(161).aiPrompt.allowedWords);
    expect(allowed.size).toBeGreaterThanOrEqual(400);
    for (let n = 162; n <= 168; n++) {
      const lesson = loadLesson(n);
      expect(lesson.kind).toBe("review");
      expect(lesson.week).toBe(24);
      expect(lesson.aiPrompt.allowedWords.length).toBe(allowed.size);
      for (const item of lesson.vocab) {
        expect(allowed.has(item.han)).toBe(true);
      }
    }
  });

  it("loads days 169–224 with valid HSK 4 schema", () => {
    const weekOf = (n: number) => Math.ceil(n / 7);
    const reviewDays = new Set([
      174, 175, 181, 182, 188, 189, 195, 196, 202, 203, 209, 210, 216, 217,
      218, 219, 220, 221, 222, 223, 224,
    ]);
    for (let n = 169; n <= 224; n++) {
      const lesson = loadLesson(n);
      expect(lesson.id).toBe(n);
      expect(lesson.week).toBe(weekOf(n));
      expect(lesson.hsk).toBe(4);
      expect(lesson.vocab.length).toBeGreaterThanOrEqual(4);
      expect(lesson.dialogue.length).toBeGreaterThanOrEqual(4);
      expect(lesson.timer).toEqual({
        review: 5,
        vocab: 8,
        grammar: 8,
        talk: 5,
        ai: 4,
      });
      expect(lesson.kind).toBe(reviewDays.has(n) ? "review" : "learn");
    }
    expect(loadLesson(169).theme).toBe("Lương");
    expect(loadLesson(176).theme).toBe("Tin");
    expect(loadLesson(183).theme).toBe("Internet");
    expect(loadLesson(224).theme).toBe("AI tốt nghiệp");
  });

  it("locks week 32 to words known by week 31", () => {
    const allowed = new Set(loadLesson(217).aiPrompt.allowedWords);
    expect(allowed.size).toBeGreaterThanOrEqual(550);
    for (let n = 218; n <= 224; n++) {
      const lesson = loadLesson(n);
      expect(lesson.kind).toBe("review");
      expect(lesson.week).toBe(32);
      expect(lesson.aiPrompt.allowedWords.length).toBe(allowed.size);
      for (const item of lesson.vocab) {
        expect(allowed.has(item.han)).toBe(true);
      }
    }
  });
});

describe("parseLesson", () => {
  it("fails if a required field is missing", () => {
    const raw = JSON.parse(readFileSync(day1Path, "utf8")) as Record<
      string,
      unknown
    >;
    delete raw.theme;
    expect(() => parseLesson(raw)).toThrow(/Thiếu field bắt buộc: theme/);
  });
});
