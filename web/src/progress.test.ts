import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PROFILE_KEY,
  PROGRESS_KEY,
  completeOnboarding,
  currentStreak,
  findUser,
  globalDayFromLocal,
  hasProfile,
  isDayComplete,
  loadProfile,
  loadProgress,
  markDayComplete,
  markDaysCompleteThrough,
  nextUnfinishedDay,
} from "./progress";

const mem = new Map<string, string>();

beforeEach(() => {
  mem.clear();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => mem.get(key) ?? null,
    setItem: (key: string, value: string) => {
      mem.set(key, value);
    },
    removeItem: (key: string) => {
      mem.delete(key);
    },
    clear: () => {
      mem.clear();
    },
    key: () => null,
    length: 0,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("progress", () => {
  it("saves completedDays and lastCompletedAt", () => {
    const at = new Date("2026-09-08T04:00:00.000Z");
    const saved = markDayComplete(1, at);
    expect(saved.completedDays).toEqual([1]);
    expect(saved.lastCompletedAt).toBe("2026-09-08T04:00:00.000Z");
    expect(JSON.parse(mem.get(PROGRESS_KEY) ?? "{}")).toMatchObject({
      completedDays: [1],
      lastCompletedAt: "2026-09-08T04:00:00.000Z",
    });
  });

  it("still has the mark after loadProgress", () => {
    markDayComplete(3, new Date("2026-09-08T05:00:00.000Z"));
    expect(isDayComplete(3)).toBe(true);
    expect(loadProgress().completedDays).toEqual([3]);
  });

  it("grows streak on consecutive calendar days and drops after a skip", () => {
    markDayComplete(1, new Date(2026, 8, 6, 10, 0, 0));
    expect(currentStreak(loadProgress(), new Date(2026, 8, 6, 22, 0, 0))).toBe(
      1,
    );
    markDayComplete(2, new Date(2026, 8, 7, 10, 0, 0));
    expect(currentStreak(loadProgress(), new Date(2026, 8, 7, 22, 0, 0))).toBe(
      2,
    );
    expect(currentStreak(loadProgress(), new Date(2026, 8, 9, 10, 0, 0))).toBe(
      0,
    );
  });

  it("suggests the lowest unfinished lesson", () => {
    markDayComplete(1, new Date(2026, 8, 8));
    markDayComplete(3, new Date(2026, 8, 8));
    expect(nextUnfinishedDay()).toBe(2);
  });

  it("marks every earlier lesson complete through a day", () => {
    const at = new Date("2026-09-10T04:00:00.000Z");
    const saved = markDaysCompleteThrough(globalDayFromLocal(2, 10), at);
    expect(saved.completedDays).toHaveLength(66);
    expect(isDayComplete(56)).toBe(true);
    expect(isDayComplete(66)).toBe(true);
    expect(isDayComplete(67)).toBe(false);
    expect(nextUnfinishedDay()).toBe(67);
  });

  it("saves a new learner without completing past lessons", () => {
    expect(hasProfile()).toBe(false);
    const result = completeOnboarding({
      name: " Thủy ",
      userId: "thuy01",
      kind: "new",
    });
    expect(loadProfile()).toEqual({ name: "Thủy", userId: "thuy01" });
    expect(loadProgress().completedDays).toEqual([]);
    expect(result.hash).toBe("#/hsk1/day/1");
    expect(findUser("THUY01")?.name).toBe("Thủy");
  });

  it("confirms an existing learner and checks off earlier days", () => {
    const result = completeOnboarding(
      {
        name: "Lan",
        userId: "lan02",
        kind: "existing",
        hsk: 3,
        localDay: 4,
      },
      new Date("2026-09-10T04:00:00.000Z"),
    );
    expect(loadProgress().completedDays).toHaveLength(116);
    expect(isDayComplete(116)).toBe(true);
    expect(isDayComplete(117)).toBe(false);
    expect(result.hash).toBe("#/hsk3/day/117");
    expect(mem.get(PROFILE_KEY)).toContain("lan02");
  });

  it("resumes a stored user by id instead of wiping their progress", () => {
    completeOnboarding({
      name: "Lan",
      userId: "lan02",
      kind: "existing",
      hsk: 2,
      localDay: 3,
    });
    completeOnboarding({
      name: "Minh",
      userId: "other",
      kind: "new",
    });
    expect(loadProgress().completedDays).toEqual([]);
    const resumed = completeOnboarding({
      name: "Lan",
      userId: "LAN02",
      kind: "existing",
      hsk: 2,
      localDay: 3,
    });
    expect(loadProfile()?.name).toBe("Lan");
    expect(isDayComplete(59)).toBe(true);
    expect(resumed.hash).toBe("#/hsk2/day/60");
  });
});
