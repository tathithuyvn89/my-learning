import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadEnLesson, parseEnLesson } from "./en-content";
import { EN_TIMER } from "./en-lesson";
import { reviewForEnDay } from "./en-review";

const day1Path = join(
  dirname(fileURLToPath(import.meta.url)),
  "../content/en/001.json",
);

describe("loadEnLesson", () => {
  it("returns day 1", () => {
    const lesson = loadEnLesson(1);
    expect(lesson.id).toBe(1);
    expect(lesson.week).toBe(1);
    expect(lesson.theme).toBe("Chào Slack");
    expect(lesson.kind).toBe("learn");
    expect(lesson.phrases.length).toBeGreaterThanOrEqual(4);
    expect(lesson.dialogue.length).toBeGreaterThanOrEqual(8);
    expect(lesson.listen.unseen.length).toBeGreaterThanOrEqual(8);
    expect(lesson.listen.tasks.length).toBeGreaterThanOrEqual(1);
    expect(lesson.listen.video).not.toBeNull();
    expect(lesson.aiPrompt.turns).toBeGreaterThanOrEqual(8);
    expect(lesson.timer).toEqual(EN_TIMER);
    expect(lesson.timer).toEqual({
      review: 4,
      vocab: 5,
      grammar: 8,
      talk: 8,
      ai: 5,
    });
  });

  it("loads days 1–30 with valid schema", () => {
    const reviewDays = new Set([6, 7, 13, 14, 20, 21, 27, 28, 29, 30]);
    const videoDays = new Set([1, 6, 8, 13, 15, 19, 22, 27]);
    for (let n = 1; n <= 30; n++) {
      const lesson = loadEnLesson(n);
      expect(lesson.id).toBe(n);
      expect(lesson.phrases.length).toBeGreaterThanOrEqual(4);
      expect(lesson.dialogue.length).toBeGreaterThanOrEqual(8);
      expect(lesson.listen.unseen.length).toBeGreaterThanOrEqual(8);
      expect(lesson.listen.tasks.length).toBeGreaterThanOrEqual(1);
      expect(lesson.listen.methodVi.length).toBeGreaterThan(0);
      expect(lesson.aiPrompt.turns).toBeGreaterThanOrEqual(8);
      expect(lesson.kind).toBe(reviewDays.has(n) ? "review" : "learn");
      expect(lesson.timer).toEqual(EN_TIMER);
      if (videoDays.has(n)) expect(lesson.listen.video).not.toBeNull();
      else expect(lesson.listen.video).toBeNull();
      if (n <= 7) expect(lesson.week).toBe(1);
      else if (n <= 14) expect(lesson.week).toBe(2);
      else if (n <= 21) expect(lesson.week).toBe(3);
      else if (n <= 28) expect(lesson.week).toBe(4);
      else expect(lesson.week).toBe(5);
    }
  });

  it("loads interview days 1–21 with valid schema", () => {
    const reviewDays = new Set([6, 7, 13, 14, 20, 21]);
    const videoDays = new Set([1, 6, 8, 13, 15, 20]);
    const lesson1 = loadEnLesson(1, "iv");
    expect(lesson1.theme).toBe("Clarify");
    expect(loadEnLesson(8, "iv").theme).toBe("Requirements");
    expect(loadEnLesson(19, "iv").theme).toBe("Lương");
    expect(loadEnLesson(21, "iv").theme).toBe("Mock loop AI");
    for (let n = 1; n <= 21; n++) {
      const lesson = loadEnLesson(n, "iv");
      expect(lesson.id).toBe(n);
      expect(lesson.phrases.length).toBeGreaterThanOrEqual(4);
      expect(lesson.dialogue.length).toBeGreaterThanOrEqual(8);
      expect(lesson.listen.unseen.length).toBeGreaterThanOrEqual(8);
      expect(lesson.listen.tasks.length).toBeGreaterThanOrEqual(1);
      expect(lesson.listen.methodVi.length).toBeGreaterThan(0);
      expect(lesson.aiPrompt.turns).toBeGreaterThanOrEqual(8);
      expect(lesson.kind).toBe(reviewDays.has(n) ? "review" : "learn");
      expect(lesson.timer).toEqual(EN_TIMER);
      if (videoDays.has(n)) expect(lesson.listen.video).not.toBeNull();
      else expect(lesson.listen.video).toBeNull();
      if (n <= 7) expect(lesson.week).toBe(1);
      else if (n <= 14) expect(lesson.week).toBe(2);
      else expect(lesson.week).toBe(3);
    }
  });

  it("fails when a required English field is missing", () => {
    const raw = JSON.parse(readFileSync(day1Path, "utf8")) as Record<
      string,
      unknown
    >;
    delete raw.theme;
    expect(() => parseEnLesson(raw)).toThrow(/theme/);
  });

  it("fails when listen is missing", () => {
    const raw = JSON.parse(readFileSync(day1Path, "utf8")) as Record<
      string,
      unknown
    >;
    delete raw.listen;
    expect(() => parseEnLesson(raw)).toThrow(/listen/);
  });
});

describe("reviewForEnDay", () => {
  it("keeps repair phrases after day 10", () => {
    const set = reviewForEnDay(11);
    const ens = set.phrases.map((item) => item.en);
    expect(ens).toContain("Could you repeat that?");
    expect(ens).toContain("What I heard is…");
  });
});
