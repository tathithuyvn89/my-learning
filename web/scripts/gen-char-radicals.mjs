/**
 * Sinh web/src/char-radicals.json từ vocab JSON + CCD decomposition.
 * Chạy: npm run gen:radicals
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ccd from "chinese-characters-decomposition";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const daysDir = path.join(root, "content/days");
const outFile = path.join(root, "src/char-radicals.json");
const labelsFile = path.join(root, "src/radical-vi.json");

const RADICAL_VI = JSON.parse(fs.readFileSync(labelsFile, "utf8"));
const STRUCTURE_VI = {
  "*": "đơn thể",
  一: "đơn thể",
  吅: "trái–phải",
  吕: "trên–dưới",
  回: "bao quanh",
  咒: "trên hai phần",
  厶: "lồng nhau",
  符: "chồng lên",
};

function radicalVi(ch) {
  return RADICAL_VI[ch] ?? ch;
}

function structureVi(code) {
  return STRUCTURE_VI[code] ?? code;
}

const idx = Object.fromEntries(ccd.headers.map((h, i) => [h, i]));
const ccdMap = new Map(
  ccd.rows.map((row) => [row[idx.component], row]),
);

const HAN = /\p{Script=Han}/u;

function collectHanChars() {
  const chars = new Set();
  for (const file of fs.readdirSync(daysDir)) {
    if (!file.endsWith(".json")) continue;
    const lesson = JSON.parse(
      fs.readFileSync(path.join(daysDir, file), "utf8"),
    );
    for (const item of lesson.vocab ?? []) {
      for (const ch of item.han ?? "") {
        if (HAN.test(ch)) chars.add(ch);
      }
    }
  }
  return [...chars].sort();
}

function partsOf(ch, depth = 2) {
  const row = ccdMap.get(ch);
  if (!row || depth <= 0) return [ch];
  const left = row[idx.leftComponent];
  const right = row[idx.rightComponent];
  if (!left && !right) return [ch];
  const out = [];
  if (left) {
    out.push(...(depth > 1 ? partsOf(left, depth - 1) : [left]));
  }
  if (right) {
    out.push(...(depth > 1 ? partsOf(right, depth - 1) : [right]));
  }
  return out.length ? out : [ch];
}

function annotate(ch) {
  const row = ccdMap.get(ch);
  if (!row) return null;
  const structure = row[idx.compositionType];
  const radical = row[idx.section];
  const parts = partsOf(ch, 2);
  return {
    strokes: row[idx.strokes],
    structure,
    structureVi: structureVi(structure),
    radical,
    radicalVi: radical ? radicalVi(radical) : null,
    parts,
    partsVi: parts.map((p) => radicalVi(p)),
  };
}

const chars = collectHanChars();
const data = {};
let missing = 0;
for (const ch of chars) {
  const entry = annotate(ch);
  if (entry) data[ch] = entry;
  else missing += 1;
}

fs.writeFileSync(outFile, `${JSON.stringify(data, null, 2)}\n`);
console.log(
  `Wrote ${Object.keys(data).length} entries to ${path.relative(root, outFile)} (${missing} missing in CCD)`,
);
