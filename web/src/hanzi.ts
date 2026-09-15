import { annotationElement } from "./radical";

const WRITER_SIZE = 140;
const STROKE_COLOR = "#b33a2b";
const RADICAL_COLOR = "#2d7a4f";
const OUTLINE_COLOR = "#ddd";
const HIGHLIGHT_COLOR = "#e8a090";

const WRITE_SVG = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M4 20h4.5l9.9-9.9a1.8 1.8 0 0 0 0-2.55l-1.85-1.85a1.8 1.8 0 0 0-2.55 0L4 15.5V20Zm2.1-2.9 9.9-9.9 1.05 1.05-9.9 9.9H6.1v-1.05ZM18.7 3.3a1.1 1.1 0 0 1 1.55 0l1.05 1.05a1.1 1.1 0 0 1 0 1.55l-1.2 1.2-2.6-2.6 1.2-1.2Z"
    />
  </svg>
`;

/** Ký tự Hán (giản thể / HSK). */
const HAN_CHAR_RE = /\p{Script=Han}/u;

type HanziWriterCtor = typeof import("hanzi-writer").default;

let writerModule: Promise<HanziWriterCtor> | null = null;

function loadHanziWriter(): Promise<HanziWriterCtor> {
  writerModule ??= import("hanzi-writer").then((mod) => mod.default);
  return writerModule;
}

export function hanChars(text: string): string[] {
  return [...text].filter((ch) => HAN_CHAR_RE.test(ch));
}

function writerOptions() {
  return {
    width: WRITER_SIZE,
    height: WRITER_SIZE,
    padding: 8,
    showOutline: true,
    strokeColor: STROKE_COLOR,
    radicalColor: RADICAL_COLOR,
    outlineColor: OUTLINE_COLOR,
    drawingColor: STROKE_COLOR,
    highlightColor: HIGHLIGHT_COLOR,
  };
}

/** Khối luyện viết — bấm icon + chữ để mở. */
export function writePracticePanel(han: string): HTMLElement | null {
  const chars = hanChars(han);
  if (chars.length === 0) return null;

  const details = document.createElement("details");
  details.className = "hanzi-practice";

  const summary = document.createElement("summary");
  summary.className = "hanzi-practice-trigger";

  const icon = document.createElement("span");
  icon.className = "hanzi-practice-icon";
  icon.innerHTML = WRITE_SVG;

  const label = document.createElement("span");
  label.className = "hanzi-practice-label";
  label.textContent = "Luyện viết";

  summary.append(icon, label);
  details.append(summary);

  const grid = document.createElement("div");
  grid.className = "hanzi-grid";
  details.append(grid);

  let initialized = false;

  function initWriters(): void {
    if (initialized) return;
    initialized = true;

    void loadHanziWriter().then((HanziWriter) => {
      for (const ch of chars) {
        const cell = document.createElement("div");
        cell.className = "hanzi-cell";

        const charLabel = document.createElement("p");
        charLabel.className = "hanzi-char-label han";
        charLabel.textContent = ch;

        const annotation = annotationElement(ch);

        const target = document.createElement("div");
        target.className = "hanzi-target";
        target.setAttribute("aria-label", `Luyện viết ${ch}`);

        const controls = document.createElement("div");
        controls.className = "hanzi-controls";

        const animateBtn = document.createElement("button");
        animateBtn.type = "button";
        animateBtn.className = "hanzi-btn";
        animateBtn.textContent = "Xem nét";

        const quizBtn = document.createElement("button");
        quizBtn.type = "button";
        quizBtn.className = "hanzi-btn hanzi-btn-primary";
        quizBtn.textContent = "Tự viết";

        controls.append(animateBtn, quizBtn);
        cell.append(charLabel);
        if (annotation) cell.append(annotation);
        cell.append(target, controls);
        grid.append(cell);

        const writer = HanziWriter.create(target, ch, writerOptions());

        animateBtn.addEventListener("click", () => {
          void writer.animateCharacter();
        });
        quizBtn.addEventListener("click", () => {
          void writer.quiz();
        });
      }
    });
  }

  details.addEventListener("toggle", () => {
    if (details.open) initWriters();
  });

  return details;
}
