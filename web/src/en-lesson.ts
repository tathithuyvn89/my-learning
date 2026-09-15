export type EnTimerSpec = {
  review: 4;
  vocab: 5;
  grammar: 8;
  talk: 8;
  ai: 5;
};

export type EnPhrase = {
  en: string;
  note: string;
  vi: string;
  example: { en: string; vi: string };
  slot?: string;
};

export type EnLine = {
  speaker: "A" | "B";
  en: string;
  vi: string;
};

export type EnListenVideo = {
  title: string;
  url: string;
  watchFrom: string;
  watchTo: string;
  whyVi: string;
};

export type EnListenTask = {
  type: "gist" | "cloze" | "repair";
  prompt: string;
  answer: string;
};

export type EnListen = {
  title: string;
  video: EnListenVideo | null;
  unseen: EnLine[];
  tasks: EnListenTask[];
  methodVi: string;
};

export type EnLesson = {
  id: number;
  week: number;
  theme: string;
  kind: "learn" | "review";
  phrases: EnPhrase[];
  pattern: {
    title: string;
    pattern: string;
    explainVi: string;
    drills: Array<{ prompt: string; answer: string }>;
  };
  listen: EnListen;
  dialogue: EnLine[];
  exercises: Array<{ type: string; prompt: string; answer: string }>;
  aiPrompt: {
    scenario: string;
    system: string;
    allowedPhrases: string[];
    turns: number;
  };
  timer: EnTimerSpec;
};

export const EN_TIMER: EnTimerSpec = {
  review: 4,
  vocab: 5,
  grammar: 8,
  talk: 8,
  ai: 5,
};

export const EN_SLOW_RATE = 0.85;

export { youglishHref } from "./youglish";
