import { describe, expect, it } from "vitest";
import { parseHash } from "./router";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_URL,
  seoForRoute,
} from "./seo";

describe("seoForRoute", () => {
  it("describes the default HSK home", () => {
    const seo = seoForRoute(parseHash("#/hsk1"));
    expect(seo.title).toContain("HSK 1");
    expect(seo.description).toContain("30 phút");
    expect(seo.robots).toBe("index,follow");
  });

  it("includes the lesson theme in the day title", () => {
    const seo = seoForRoute(parseHash("#/hsk1/day/1"));
    expect(seo.title).toMatch(/ngày 1/i);
    expect(seo.title.length).toBeGreaterThan(10);
  });

  it("describes English IT home", () => {
    const seo = seoForRoute(parseHash("#/en"));
    expect(seo.title).toContain("tiếng Anh IT");
    expect(seo.description).toContain("nghe–nói");
  });

  it("marks missing pages noindex", () => {
    const seo = seoForRoute(parseHash("#/en/seo"));
    expect(seo.robots).toBe("noindex,follow");
    expect(seo.title).toContain("Không tìm thấy");
  });
});

describe("default copy", () => {
  it("uses the production site URL", () => {
    expect(SITE_URL).toBe("https://hoc.thungchitieu.com.vn");
  });

  it("keeps HSK in the static title used by index.html", () => {
    expect(DEFAULT_TITLE).toContain("Học tiếng Trung HSK 1–6");
    expect(DEFAULT_DESCRIPTION.length).toBeGreaterThan(80);
    expect(DEFAULT_DESCRIPTION.length).toBeLessThan(200);
  });
});
