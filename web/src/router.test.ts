import { describe, expect, it } from "vitest";
import { parseHash } from "./router";

describe("parseHash", () => {
  it("defaults empty hash to HSK 1 home", () => {
    expect(parseHash("")).toEqual({ name: "home", hsk: 1 });
    expect(parseHash("#/")).toEqual({ name: "home", hsk: 1 });
  });

  it("parses HSK 1, 2 and 3 menus", () => {
    expect(parseHash("#/hsk1")).toEqual({ name: "home", hsk: 1 });
    expect(parseHash("#/hsk2")).toEqual({ name: "home", hsk: 2 });
    expect(parseHash("#/hsk3")).toEqual({ name: "home", hsk: 3 });
    expect(parseHash("#/hsk4")).toEqual({ name: "home", hsk: 4 });
    expect(parseHash("#/hsk2/calendar")).toEqual({
      name: "calendar",
      hsk: 2,
    });
    expect(parseHash("#/hsk1/words")).toEqual({ name: "words", hsk: 1 });
    expect(parseHash("#/hsk2/progress")).toEqual({
      name: "progress",
      hsk: 2,
    });
    expect(parseHash("#/hsk3/words")).toEqual({ name: "words", hsk: 3 });
    expect(parseHash("#/hsk4/words")).toEqual({ name: "words", hsk: 4 });
  });

  it("keeps legacy routes as HSK 1", () => {
    expect(parseHash("#/calendar")).toEqual({ name: "calendar", hsk: 1 });
    expect(parseHash("#/words")).toEqual({ name: "words", hsk: 1 });
    expect(parseHash("#/progress")).toEqual({ name: "progress", hsk: 1 });
  });

  it("infers HSK from the day number", () => {
    expect(parseHash("#/day/1")).toEqual({ name: "day", hsk: 1, day: 1 });
    expect(parseHash("#/hsk2/day/57")).toEqual({
      name: "day",
      hsk: 2,
      day: 57,
    });
    expect(parseHash("#/day/57")).toEqual({ name: "day", hsk: 2, day: 57 });
    expect(parseHash("#/hsk3/day/113")).toEqual({
      name: "day",
      hsk: 3,
      day: 113,
    });
    expect(parseHash("#/day/113")).toEqual({ name: "day", hsk: 3, day: 113 });
    expect(parseHash("#/hsk4/day/169")).toEqual({
      name: "day",
      hsk: 4,
      day: 169,
    });
    expect(parseHash("#/day/169")).toEqual({ name: "day", hsk: 4, day: 169 });
  });

  it("rejects days outside 1–224", () => {
    expect(parseHash("#/day/0")).toEqual({ name: "not-found" });
    expect(parseHash("#/day/225")).toEqual({ name: "not-found" });
  });
});
