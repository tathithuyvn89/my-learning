import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("skeleton", () => {
  it("has the HSK 1–6 page title and description", () => {
    const html = readFileSync(join(root, "index.html"), "utf8");
    expect(html).toContain("Học tiếng Trung HSK 1–6");
    expect(html).toContain('name="description"');
    expect(html).toContain("application/ld+json");
    expect(html).toContain("og:title");
    expect(html).toContain("favicon.png");
  });
});
