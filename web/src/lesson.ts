import type { HskLevel } from "./course";

export type Lesson = {
  id: number;
  week: number;
  hsk: HskLevel;
  theme: string;
  kind: "learn" | "review";
  vocab: Array<{
    han: string;
    pinyin: string;
    vi: string;
    example: { han: string; pinyin: string; vi: string };
  }>;
  grammar: {
    title: string;
    pattern: string;
    explainVi: string;
    drills: Array<{ prompt: string; answer: string }>;
  };
  dialogue: Array<{
    speaker: "A" | "B";
    han: string;
    pinyin: string;
    vi: string;
  }>;
  exercises: Array<{ type: string; prompt: string; answer: string }>;
  aiPrompt: {
    scenario: string;
    system: string;
    allowedWords: string[];
    turns: number;
  };
  timer: {
    review: 5;
    vocab: 8;
    grammar: 8;
    talk: 5;
    ai: 4;
  };
};
