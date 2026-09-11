export type BlockId = "review" | "vocab" | "grammar" | "talk" | "ai";

export type TimerSpec = {
  review: 5;
  vocab: 8;
  grammar: 8;
  talk: 5;
  ai: 4;
};

export type SessionBlock = {
  id: BlockId;
  minutes: number;
  seconds: number;
  hintOnEnd: string;
};

export type SessionTimer = {
  blocks: SessionBlock[];
  blockIndex: number;
  remaining: number;
  running: boolean;
  hint: string | null;
};

const HINTS: Record<BlockId, string> = {
  review: "Hết khối ôn. Chuyển sang tab Từ vựng.",
  vocab: "Hết khối từ vựng. Chuyển sang tab Ngữ pháp.",
  grammar: "Hết khối ngữ pháp. Chuyển sang tab Hội thoại.",
  talk: "Hết khối hội thoại. Chuyển sang tab Prompt AI.",
  ai: "Hết 30 phút.",
};

export function createSessionTimer(spec: TimerSpec): SessionTimer {
  const blocks: SessionBlock[] = [
    {
      id: "review",
      minutes: spec.review,
      seconds: spec.review * 60,
      hintOnEnd: HINTS.review,
    },
    {
      id: "vocab",
      minutes: spec.vocab,
      seconds: spec.vocab * 60,
      hintOnEnd: HINTS.vocab,
    },
    {
      id: "grammar",
      minutes: spec.grammar,
      seconds: spec.grammar * 60,
      hintOnEnd: HINTS.grammar,
    },
    {
      id: "talk",
      minutes: spec.talk,
      seconds: spec.talk * 60,
      hintOnEnd: HINTS.talk,
    },
    {
      id: "ai",
      minutes: spec.ai,
      seconds: spec.ai * 60,
      hintOnEnd: HINTS.ai,
    },
  ];
  return {
    blocks,
    blockIndex: 0,
    remaining: blocks[0].seconds,
    running: false,
    hint: null,
  };
}

export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function startTimer(state: SessionTimer): SessionTimer {
  if (state.remaining === 0 && state.blockIndex >= state.blocks.length - 1) {
    return state;
  }
  return { ...state, running: true, hint: null };
}

export function pauseTimer(state: SessionTimer): SessionTimer {
  return { ...state, running: false };
}

export function tickTimer(state: SessionTimer): SessionTimer {
  if (!state.running || state.remaining <= 0) {
    return { ...state, running: false };
  }
  const nextRemaining = state.remaining - 1;
  if (nextRemaining > 0) {
    return { ...state, remaining: nextRemaining };
  }
  const ended = state.blocks[state.blockIndex];
  if (state.blockIndex < state.blocks.length - 1) {
    const nextIndex = state.blockIndex + 1;
    return {
      ...state,
      blockIndex: nextIndex,
      remaining: state.blocks[nextIndex].seconds,
      running: false,
      hint: ended.hintOnEnd,
    };
  }
  return {
    ...state,
    remaining: 0,
    running: false,
    hint: ended.hintOnEnd,
  };
}
