const WRITER_SIZE = 140;
const STROKE_COLOR = "#b33a2b";
const OUTLINE_COLOR = "#ddd";
const HIGHLIGHT_COLOR = "#e8a090";

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
    outlineColor: OUTLINE_COLOR,
    drawingColor: STROKE_COLOR,
    highlightColor: HIGHLIGHT_COLOR,
  };
}

/** Khối luyện viết — lazy-init khi mở `<details>`. */
export function writePracticePanel(han: string): HTMLElement | null {
  const chars = hanChars(han);
  if (chars.length === 0) return null;

  const details = document.createElement("details");
  details.className = "hanzi-practice";

  const summary = document.createElement("summary");
  summary.textContent = "Luyện viết";
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

        const label = document.createElement("p");
        label.className = "hanzi-char-label han";
        label.textContent = ch;

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
        cell.append(label, target, controls);
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
