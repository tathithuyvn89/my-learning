import { describe, expect, it } from "vitest";
import { collectVocab, vocabForHsk, vocabForWeek } from "./vocab-index";

describe("vocab-index", () => {
  it("merges vocab from JSON, unique by han for all weeks", () => {
    const all = vocabForWeek("all");
    const hello = all.find((item) => item.han === "你好");
    expect(hello).toBeDefined();
    expect(hello?.day).toBe(1);
    expect(hello?.week).toBe(1);
    expect(all.filter((item) => item.han === "你好")).toHaveLength(1);
    expect(all.length).toBeGreaterThanOrEqual(100);
  });

  it("filters by week from lesson JSON", () => {
    const week1 = vocabForWeek(1);
    expect(week1.some((item) => item.han === "你好")).toBe(true);
    expect(week1.every((item) => item.week === 1)).toBe(true);

    const week5 = vocabForWeek(5);
    expect(week5.some((item) => item.han === "买")).toBe(true);
    expect(week5.every((item) => item.week === 5)).toBe(true);

    const week8 = vocabForWeek(8);
    expect(week8.length).toBeGreaterThanOrEqual(4);
    expect(week8.every((item) => item.week === 8)).toBe(true);

    const week9 = vocabForWeek(9);
    expect(week9.some((item) => item.han === "起床")).toBe(true);
    expect(week9.every((item) => item.week === 9)).toBe(true);
  });

  it("scopes sổ từ to one HSK level", () => {
    const hsk1 = vocabForHsk(1, "all");
    const hsk2 = vocabForHsk(2, "all");
    expect(hsk1.every((item) => item.week <= 8)).toBe(true);
    expect(hsk2.every((item) => item.week >= 9)).toBe(true);
    expect(hsk1.some((item) => item.han === "你好")).toBe(true);
    expect(hsk1.some((item) => item.han === "起床")).toBe(false);
    expect(hsk2.some((item) => item.han === "起床")).toBe(true);

    const hsk3 = vocabForHsk(3, "all");
    expect(hsk3.every((item) => item.week >= 17)).toBe(true);
    expect(hsk3.some((item) => item.han === "刚才")).toBe(true);
    expect(hsk2.some((item) => item.han === "刚才")).toBe(false);

    const hsk4 = vocabForHsk(4, "all");
    expect(hsk4.every((item) => item.week >= 25)).toBe(true);
    expect(hsk4.some((item) => item.han === "工资")).toBe(true);
    expect(hsk3.some((item) => item.han === "工资")).toBe(false);
  });

  it("does not invent words outside JSON", () => {
    const hans = new Set(collectVocab().map((item) => item.han));
    expect(hans.has("你好")).toBe(true);
    expect(hans.has("HSK2-fake")).toBe(false);
  });
});
