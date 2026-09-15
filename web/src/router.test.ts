import { describe, expect, it } from "vitest";
import { parseHash } from "./router";

describe("parseHash", () => {
  it("defaults empty hash to HSK 1 home", () => {
    expect(parseHash("")).toEqual({ name: "home", track: "zh", hsk: 1 });
    expect(parseHash("#/")).toEqual({ name: "home", track: "zh", hsk: 1 });
  });

  it("parses HSK 1, 2 and 3 menus", () => {
    expect(parseHash("#/hsk1")).toEqual({ name: "home", track: "zh", hsk: 1 });
    expect(parseHash("#/hsk2")).toEqual({ name: "home", track: "zh", hsk: 2 });
    expect(parseHash("#/hsk3")).toEqual({ name: "home", track: "zh", hsk: 3 });
    expect(parseHash("#/hsk4")).toEqual({ name: "home", track: "zh", hsk: 4 });
    expect(parseHash("#/hsk5")).toEqual({ name: "home", track: "zh", hsk: 5 });
    expect(parseHash("#/hsk6")).toEqual({ name: "home", track: "zh", hsk: 6 });
    expect(parseHash("#/hsk2/calendar")).toEqual({
      name: "calendar",
      track: "zh",
      hsk: 2,
    });
    expect(parseHash("#/hsk1/words")).toEqual({
      name: "words",
      track: "zh",
      hsk: 1,
    });
    expect(parseHash("#/hsk2/progress")).toEqual({
      name: "progress",
      track: "zh",
      hsk: 2,
    });
    expect(parseHash("#/hsk3/words")).toEqual({
      name: "words",
      track: "zh",
      hsk: 3,
    });
    expect(parseHash("#/hsk4/words")).toEqual({
      name: "words",
      track: "zh",
      hsk: 4,
    });
    expect(parseHash("#/hsk5/words")).toEqual({
      name: "words",
      track: "zh",
      hsk: 5,
    });
    expect(parseHash("#/hsk6/words")).toEqual({
      name: "words",
      track: "zh",
      hsk: 6,
    });
  });

  it("keeps legacy routes as HSK 1", () => {
    expect(parseHash("#/calendar")).toEqual({
      name: "calendar",
      track: "zh",
      hsk: 1,
    });
    expect(parseHash("#/words")).toEqual({
      name: "words",
      track: "zh",
      hsk: 1,
    });
    expect(parseHash("#/progress")).toEqual({
      name: "progress",
      track: "zh",
      hsk: 1,
    });
  });

  it("infers HSK from the day number", () => {
    expect(parseHash("#/day/1")).toEqual({
      name: "day",
      track: "zh",
      hsk: 1,
      day: 1,
    });
    expect(parseHash("#/hsk2/day/57")).toEqual({
      name: "day",
      track: "zh",
      hsk: 2,
      day: 57,
    });
    expect(parseHash("#/day/57")).toEqual({
      name: "day",
      track: "zh",
      hsk: 2,
      day: 57,
    });
    expect(parseHash("#/hsk3/day/113")).toEqual({
      name: "day",
      track: "zh",
      hsk: 3,
      day: 113,
    });
    expect(parseHash("#/day/113")).toEqual({
      name: "day",
      track: "zh",
      hsk: 3,
      day: 113,
    });
    expect(parseHash("#/hsk4/day/169")).toEqual({
      name: "day",
      track: "zh",
      hsk: 4,
      day: 169,
    });
    expect(parseHash("#/day/169")).toEqual({
      name: "day",
      track: "zh",
      hsk: 4,
      day: 169,
    });
    expect(parseHash("#/hsk5/day/225")).toEqual({
      name: "day",
      track: "zh",
      hsk: 5,
      day: 225,
    });
    expect(parseHash("#/day/225")).toEqual({
      name: "day",
      track: "zh",
      hsk: 5,
      day: 225,
    });
    expect(parseHash("#/hsk5/day/280")).toEqual({
      name: "day",
      track: "zh",
      hsk: 5,
      day: 280,
    });
    expect(parseHash("#/hsk6/day/281")).toEqual({
      name: "day",
      track: "zh",
      hsk: 6,
      day: 281,
    });
    expect(parseHash("#/day/281")).toEqual({
      name: "day",
      track: "zh",
      hsk: 6,
      day: 281,
    });
    expect(parseHash("#/hsk6/day/336")).toEqual({
      name: "day",
      track: "zh",
      hsk: 6,
      day: 336,
    });
  });

  it("rejects days outside 1–336", () => {
    expect(parseHash("#/day/0")).toEqual({ name: "not-found" });
    expect(parseHash("#/day/337")).toEqual({ name: "not-found" });
  });

  it("parses English IT routes", () => {
    expect(parseHash("#/en")).toEqual({
      name: "home",
      track: "en",
      course: "it",
    });
    expect(parseHash("#/en/calendar")).toEqual({
      name: "calendar",
      track: "en",
      course: "it",
    });
    expect(parseHash("#/en/words")).toEqual({
      name: "words",
      track: "en",
      course: "it",
    });
    expect(parseHash("#/en/progress")).toEqual({
      name: "progress",
      track: "en",
      course: "it",
    });
    expect(parseHash("#/en/day/1")).toEqual({
      name: "day",
      track: "en",
      course: "it",
      day: 1,
    });
    expect(parseHash("#/en/day/30")).toEqual({
      name: "day",
      track: "en",
      course: "it",
      day: 30,
    });
    expect(parseHash("#/en/day/0")).toEqual({ name: "not-found" });
    expect(parseHash("#/en/day/31")).toEqual({ name: "not-found" });
  });

  it("parses English interview routes", () => {
    expect(parseHash("#/en/iv")).toEqual({
      name: "home",
      track: "en",
      course: "iv",
    });
    expect(parseHash("#/en/iv/calendar")).toEqual({
      name: "calendar",
      track: "en",
      course: "iv",
    });
    expect(parseHash("#/en/iv/words")).toEqual({
      name: "words",
      track: "en",
      course: "iv",
    });
    expect(parseHash("#/en/iv/progress")).toEqual({
      name: "progress",
      track: "en",
      course: "iv",
    });
    expect(parseHash("#/en/iv/day/1")).toEqual({
      name: "day",
      track: "en",
      course: "iv",
      day: 1,
    });
    expect(parseHash("#/en/iv/day/21")).toEqual({
      name: "day",
      track: "en",
      course: "iv",
      day: 21,
    });
    expect(parseHash("#/en/iv/day/0")).toEqual({ name: "not-found" });
    expect(parseHash("#/en/iv/day/22")).toEqual({ name: "not-found" });
  });
});
