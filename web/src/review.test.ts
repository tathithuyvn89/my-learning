import { describe, expect, it } from "vitest";
import { reviewForDay } from "./review";

describe("reviewForDay", () => {
  it("skips day 1", () => {
    expect(reviewForDay(1).words).toEqual([]);
  });

  it("uses yesterday on a learn day", () => {
    const set = reviewForDay(2);
    expect(set.label).toBe("Từ ngày 1");
    expect(set.words.length).toBeGreaterThanOrEqual(5);
    expect(set.words.length).toBeLessThanOrEqual(8);
    expect(set.words.every((item) => item.day === 1)).toBe(true);
    expect(set.words.some((item) => item.han === "你好")).toBe(true);
  });

  it("uses the whole week on a weekend review day", () => {
    const set = reviewForDay(6);
    expect(set.label).toBe("Từ tuần 1");
    expect(set.words.length).toBeGreaterThanOrEqual(5);
    expect(set.words.length).toBeLessThanOrEqual(8);
    expect(set.words.every((item) => item.week === 1 && item.day < 6)).toBe(
      true,
    );
    expect(set.words.some((item) => item.han === "你好")).toBe(true);
  });

  it("falls back to the previous week when week 8 starts", () => {
    const set = reviewForDay(50);
    expect(set.words.length).toBeGreaterThanOrEqual(5);
    expect(set.words.length).toBeLessThanOrEqual(8);
    expect(set.words.every((item) => item.day < 50)).toBe(true);
  });

  it("skips the first day of HSK 2", () => {
    expect(reviewForDay(57).words).toEqual([]);
  });

  it("labels HSK 2 review weeks from 1", () => {
    const set = reviewForDay(62);
    expect(set.label).toBe("Từ tuần 1");
    expect(set.words.every((item) => item.week === 9 && item.day < 62)).toBe(
      true,
    );
  });

  it("skips the first day of HSK 3", () => {
    expect(reviewForDay(113).words).toEqual([]);
  });

  it("labels HSK 3 review weeks from 1", () => {
    const set = reviewForDay(118);
    expect(set.label).toBe("Từ tuần 1");
    expect(set.words.every((item) => item.week === 17 && item.day < 118)).toBe(
      true,
    );
  });

  it("skips the first day of HSK 4", () => {
    expect(reviewForDay(169).words).toEqual([]);
  });

  it("labels HSK 4 review weeks from 1", () => {
    const set = reviewForDay(174);
    expect(set.label).toBe("Từ tuần 1");
    expect(set.words.every((item) => item.week === 25 && item.day < 174)).toBe(
      true,
    );
  });
});
