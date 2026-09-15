import { describe, expect, it } from "vitest";
import { youglishHref } from "./youglish";

describe("youglishHref", () => {
  it("builds a mainland Chinese URL from hanzi", () => {
    const href = youglishHref("你好", "chinese");
    expect(href).toBe(
      `https://youglish.com/pronounce/${encodeURIComponent("你好")}/chinese/cn`,
    );
    expect(href).toContain("/chinese/cn");
    expect(href).toContain(encodeURIComponent("你好"));
  });

  it("builds an English URL from a phrase", () => {
    expect(youglishHref("Could you take a look?")).toBe(
      "https://youglish.com/pronounce/Could%20you%20take%20a%20look%3F/english",
    );
  });
});
