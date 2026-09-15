import charRadicals from "./char-radicals.json";
import labels from "./radical-vi.json";

const RADICAL_VI: Record<string, string> = labels;

const STRUCTURE_VI: Record<string, string> = {
  "*": "đơn thể",
  一: "đơn thể",
  吅: "trái–phải",
  吕: "trên–dưới",
  回: "bao quanh",
  咒: "trên hai phần",
  厶: "lồng nhau",
  符: "chồng lên",
};

export function radicalVi(ch: string): string {
  return RADICAL_VI[ch] ?? ch;
}

export function structureVi(code: string): string {
  return STRUCTURE_VI[code] ?? code;
}

export type CharAnnotation = {
  strokes: number;
  structure: string;
  structureVi: string;
  radical: string | null;
  radicalVi: string | null;
  parts: string[];
  partsVi: string[];
};

const ANNOTATIONS = charRadicals as Record<string, CharAnnotation>;

export function charAnnotation(ch: string): CharAnnotation | null {
  return ANNOTATIONS[ch] ?? null;
}

export function annotationElement(ch: string): HTMLElement | null {
  const info = charAnnotation(ch);
  if (!info) return null;

  const wrap = document.createElement("div");
  wrap.className = "hanzi-annotation";

  const radical = document.createElement("p");
  radical.className = "hanzi-annotation-line";
  if (info.radical) {
    radical.append(
      document.createTextNode("Bộ thủ: "),
      span("han", info.radical),
      document.createTextNode(` (${info.radicalVi ?? info.radical})`),
    );
  } else {
    radical.textContent = "Bộ thủ: —";
  }

  const parts = document.createElement("p");
  parts.className = "hanzi-annotation-line";
  if (info.parts.length > 0) {
    parts.append(document.createTextNode("Thành phần: "));
    info.parts.forEach((part, i) => {
      if (i > 0) parts.append(document.createTextNode(" + "));
      parts.append(span("han", part));
      const vi = info.partsVi[i];
      if (vi && vi !== part) {
        parts.append(document.createTextNode(` (${vi})`));
      }
    });
  } else {
    parts.textContent = "Thành phần: —";
  }

  const meta = document.createElement("p");
  meta.className = "hanzi-annotation-meta";
  meta.textContent = `${info.strokes} nét · ${info.structureVi}`;

  wrap.append(radical, parts, meta);
  return wrap;
}

function span(className: string, text: string): HTMLSpanElement {
  const node = document.createElement("span");
  node.className = className;
  node.textContent = text;
  return node;
}
