import type { Lesson } from "./lesson";

const lessonModules = import.meta.glob("../content/days/*.json", {
  eager: true,
  import: "default",
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function missing(path: string): never {
  throw new Error(`Thiếu field bắt buộc: ${path}`);
}

function str(value: unknown, path: string): string {
  if (typeof value !== "string" || value.length === 0) missing(path);
  return value;
}

function num(value: unknown, path: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) missing(path);
  return value;
}

function arr(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) missing(path);
  return value;
}

function rec(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) missing(path);
  return value;
}

function hanBlock(value: unknown, path: string): {
  han: string;
  pinyin: string;
  vi: string;
} {
  const obj = rec(value, path);
  return {
    han: str(obj.han, `${path}.han`),
    pinyin: str(obj.pinyin, `${path}.pinyin`),
    vi: str(obj.vi, `${path}.vi`),
  };
}

export function parseLesson(raw: unknown): Lesson {
  const obj = rec(raw, "lesson");

  const id = num(obj.id, "id");
  const week = num(obj.week, "week");
  const hskRaw = num(obj.hsk, "hsk");
  if (hskRaw !== 1 && hskRaw !== 2 && hskRaw !== 3 && hskRaw !== 4) {
    missing("hsk");
  }
  const hsk: 1 | 2 | 3 | 4 =
    hskRaw === 4 ? 4 : hskRaw === 3 ? 3 : hskRaw === 2 ? 2 : 1;

  const kind = str(obj.kind, "kind");
  if (kind !== "learn" && kind !== "review") missing("kind");

  const vocab = arr(obj.vocab, "vocab").map((item, i) => {
    const v = rec(item, `vocab[${i}]`);
    return {
      ...hanBlock(v, `vocab[${i}]`),
      example: hanBlock(v.example, `vocab[${i}].example`),
    };
  });

  const grammarObj = rec(obj.grammar, "grammar");
  const grammar = {
    title: str(grammarObj.title, "grammar.title"),
    pattern: str(grammarObj.pattern, "grammar.pattern"),
    explainVi: str(grammarObj.explainVi, "grammar.explainVi"),
    drills: arr(grammarObj.drills, "grammar.drills").map((item, i) => {
      const d = rec(item, `grammar.drills[${i}]`);
      return {
        prompt: str(d.prompt, `grammar.drills[${i}].prompt`),
        answer: str(d.answer, `grammar.drills[${i}].answer`),
      };
    }),
  };

  const dialogue = arr(obj.dialogue, "dialogue").map((item, i) => {
    const d = rec(item, `dialogue[${i}]`);
    const rawSpeaker = str(d.speaker, `dialogue[${i}].speaker`);
    if (rawSpeaker !== "A" && rawSpeaker !== "B") {
      missing(`dialogue[${i}].speaker`);
    }
    const speaker: "A" | "B" = rawSpeaker === "A" ? "A" : "B";
    return {
      speaker,
      ...hanBlock(d, `dialogue[${i}]`),
    };
  });

  const exercises = arr(obj.exercises, "exercises").map((item, i) => {
    const e = rec(item, `exercises[${i}]`);
    return {
      type: str(e.type, `exercises[${i}].type`),
      prompt: str(e.prompt, `exercises[${i}].prompt`),
      answer: str(e.answer, `exercises[${i}].answer`),
    };
  });

  const ai = rec(obj.aiPrompt, "aiPrompt");
  const allowedWords = arr(ai.allowedWords, "aiPrompt.allowedWords").map(
    (word, i) => str(word, `aiPrompt.allowedWords[${i}]`),
  );
  const aiPrompt = {
    scenario: str(ai.scenario, "aiPrompt.scenario"),
    system: str(ai.system, "aiPrompt.system"),
    allowedWords,
    turns: num(ai.turns, "aiPrompt.turns"),
  };

  const t = rec(obj.timer, "timer");
  const review = num(t.review, "timer.review");
  const vocabMin = num(t.vocab, "timer.vocab");
  const grammarMin = num(t.grammar, "timer.grammar");
  const talk = num(t.talk, "timer.talk");
  const aiMin = num(t.ai, "timer.ai");
  if (
    review !== 5 ||
    vocabMin !== 8 ||
    grammarMin !== 8 ||
    talk !== 5 ||
    aiMin !== 4
  ) {
    missing("timer");
  }

  return {
    id,
    week,
    hsk,
    theme: str(obj.theme, "theme"),
    kind,
    vocab,
    grammar,
    dialogue,
    exercises,
    aiPrompt,
    timer: { review: 5, vocab: 8, grammar: 8, talk: 5, ai: 4 },
  };
}

export function loadLesson(n: number): Lesson {
  const file = `../content/days/${String(n).padStart(3, "0")}.json`;
  const raw = lessonModules[file];
  if (raw === undefined) {
    throw new Error(`Không có bài ngày ${n}`);
  }
  return parseLesson(raw);
}
