import {
  EN_TIMER,
  type EnLesson,
  type EnLine,
  type EnListen,
  type EnListenTask,
} from "./en-lesson";
import type { EnCourse } from "./course";

const itModules = import.meta.glob("../content/en/*.json", {
  eager: true,
  import: "default",
});

const ivModules = import.meta.glob("../content/en-iv/*.json", {
  eager: true,
  import: "default",
});

const LISTEN_TASK_TYPES = new Set(["gist", "cloze", "repair"]);

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

function enBlock(
  value: unknown,
  path: string,
): { en: string; vi: string } {
  const obj = rec(value, path);
  return {
    en: str(obj.en, `${path}.en`),
    vi: str(obj.vi, `${path}.vi`),
  };
}

function parseLine(value: unknown, path: string): EnLine {
  const d = rec(value, path);
  const rawSpeaker = str(d.speaker, `${path}.speaker`);
  if (rawSpeaker !== "A" && rawSpeaker !== "B") missing(`${path}.speaker`);
  return {
    speaker: rawSpeaker === "A" ? "A" : "B",
    en: str(d.en, `${path}.en`),
    vi: str(d.vi, `${path}.vi`),
  };
}

function parseListen(raw: unknown): EnListen {
  const obj = rec(raw, "listen");
  let video: EnListen["video"] = null;
  if (obj.video !== null && obj.video !== undefined) {
    const v = rec(obj.video, "listen.video");
    video = {
      title: str(v.title, "listen.video.title"),
      url: str(v.url, "listen.video.url"),
      watchFrom: str(v.watchFrom, "listen.video.watchFrom"),
      watchTo: str(v.watchTo, "listen.video.watchTo"),
      whyVi: str(v.whyVi, "listen.video.whyVi"),
    };
  }

  const unseen = arr(obj.unseen, "listen.unseen").map((item, i) =>
    parseLine(item, `listen.unseen[${i}]`),
  );
  if (unseen.length < 8) missing("listen.unseen");

  const tasks = arr(obj.tasks, "listen.tasks").map((item, i) => {
    const t = rec(item, `listen.tasks[${i}]`);
    const type = str(t.type, `listen.tasks[${i}].type`);
    if (!LISTEN_TASK_TYPES.has(type)) missing(`listen.tasks[${i}].type`);
    const task: EnListenTask = {
      type: type as EnListenTask["type"],
      prompt: str(t.prompt, `listen.tasks[${i}].prompt`),
      answer: str(t.answer, `listen.tasks[${i}].answer`),
    };
    return task;
  });
  if (tasks.length < 1) missing("listen.tasks");

  return {
    title: str(obj.title, "listen.title"),
    video,
    unseen,
    tasks,
    methodVi: str(obj.methodVi, "listen.methodVi"),
  };
}

export function parseEnLesson(raw: unknown): EnLesson {
  const obj = rec(raw, "lesson");

  const id = num(obj.id, "id");
  const week = num(obj.week, "week");
  const kind = str(obj.kind, "kind");
  if (kind !== "learn" && kind !== "review") missing("kind");

  const phrases = arr(obj.phrases, "phrases").map((item, i) => {
    const v = rec(item, `phrases[${i}]`);
    const slotRaw = v.slot;
    return {
      en: str(v.en, `phrases[${i}].en`),
      note: str(v.note, `phrases[${i}].note`),
      vi: str(v.vi, `phrases[${i}].vi`),
      example: enBlock(v.example, `phrases[${i}].example`),
      ...(typeof slotRaw === "string" && slotRaw.length > 0
        ? { slot: slotRaw }
        : {}),
    };
  });

  const patternObj = rec(obj.pattern, "pattern");
  const pattern = {
    title: str(patternObj.title, "pattern.title"),
    pattern: str(patternObj.pattern, "pattern.pattern"),
    explainVi: str(patternObj.explainVi, "pattern.explainVi"),
    drills: arr(patternObj.drills, "pattern.drills").map((item, i) => {
      const d = rec(item, `pattern.drills[${i}]`);
      return {
        prompt: str(d.prompt, `pattern.drills[${i}].prompt`),
        answer: str(d.answer, `pattern.drills[${i}].answer`),
      };
    }),
  };

  const listen = parseListen(obj.listen);

  const dialogue = arr(obj.dialogue, "dialogue").map((item, i) =>
    parseLine(item, `dialogue[${i}]`),
  );
  if (dialogue.length < 8) missing("dialogue");

  const exercises = arr(obj.exercises, "exercises").map((item, i) => {
    const e = rec(item, `exercises[${i}]`);
    return {
      type: str(e.type, `exercises[${i}].type`),
      prompt: str(e.prompt, `exercises[${i}].prompt`),
      answer: str(e.answer, `exercises[${i}].answer`),
    };
  });

  const ai = rec(obj.aiPrompt, "aiPrompt");
  const allowedPhrases = arr(ai.allowedPhrases, "aiPrompt.allowedPhrases").map(
    (word, i) => str(word, `aiPrompt.allowedPhrases[${i}]`),
  );
  const turns = num(ai.turns, "aiPrompt.turns");
  if (turns < 8) missing("aiPrompt.turns");
  const aiPrompt = {
    scenario: str(ai.scenario, "aiPrompt.scenario"),
    system: str(ai.system, "aiPrompt.system"),
    allowedPhrases,
    turns,
  };

  const t = rec(obj.timer, "timer");
  const review = num(t.review, "timer.review");
  const vocabMin = num(t.vocab, "timer.vocab");
  const grammarMin = num(t.grammar, "timer.grammar");
  const talk = num(t.talk, "timer.talk");
  const aiMin = num(t.ai, "timer.ai");
  if (
    review !== EN_TIMER.review ||
    vocabMin !== EN_TIMER.vocab ||
    grammarMin !== EN_TIMER.grammar ||
    talk !== EN_TIMER.talk ||
    aiMin !== EN_TIMER.ai
  ) {
    missing("timer");
  }

  return {
    id,
    week,
    theme: str(obj.theme, "theme"),
    kind,
    phrases,
    pattern,
    listen,
    dialogue,
    exercises,
    aiPrompt,
    timer: { ...EN_TIMER },
  };
}

export function loadEnLesson(n: number, course: EnCourse = "it"): EnLesson {
  const folder = course === "iv" ? "en-iv" : "en";
  const modules = course === "iv" ? ivModules : itModules;
  const file = `../content/${folder}/${String(n).padStart(3, "0")}.json`;
  const raw = modules[file];
  if (raw === undefined) {
    const label = course === "iv" ? "phỏng vấn" : "tiếng Anh";
    throw new Error(`Không có bài ${label} ngày ${n}`);
  }
  return parseEnLesson(raw);
}
