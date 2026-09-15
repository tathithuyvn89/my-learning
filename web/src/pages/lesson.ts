import { loadLesson } from "../content";
import {
  FIRST_DAY,
  LAST_DAY,
  firstDayOfHsk,
  hrefDay,
  hskOfDay,
  lastDayOfHsk,
  localDayOf,
} from "../course";
import type { Lesson } from "../lesson";
import { isDayComplete, markDayComplete } from "../progress";
import { reviewForDay } from "../review";
import { writePracticePanel } from "../hanzi";
import { listenButton } from "../speak";
import { youglishHref } from "../youglish";
import {
  createSessionTimer,
  formatClock,
  pauseTimer,
  startTimer,
  tickTimer,
  type BlockId,
  type SessionTimer,
} from "../timer";

type TabId = "vocab" | "grammar" | "talk" | "ai";

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "vocab", label: "Từ vựng" },
  { id: "grammar", label: "Ngữ pháp" },
  { id: "talk", label: "Hội thoại" },
  { id: "ai", label: "Prompt AI" },
];

const PHASE_LABEL: Record<BlockId, string> = {
  review: "Ôn bài",
  vocab: "Từ vựng",
  grammar: "Ngữ pháp",
  talk: "Hội thoại",
  ai: "Prompt AI",
};

function sessionElapsed(timer: SessionTimer): { done: number; total: number } {
  const total = timer.blocks.reduce((sum, block) => sum + block.seconds, 0);
  let done = 0;
  for (let i = 0; i < timer.blockIndex; i++) {
    done += timer.blocks[i].seconds;
  }
  const current = timer.blocks[timer.blockIndex];
  if (current) done += current.seconds - timer.remaining;
  return { done, total };
}

function hiddenAnswer(text: string): HTMLElement {
  const fold = document.createElement("details");
  fold.className = "answer-fold";
  const summary = document.createElement("summary");
  summary.textContent = "Hiện đáp án";
  fold.append(summary, textEl("p", text, "answer"));
  return fold;
}

function textEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text: string,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

function actionRow(...nodes: HTMLElement[]): HTMLElement {
  const row = document.createElement("div");
  row.className = "word-actions";
  row.append(...nodes);
  return row;
}

function youglishLink(han: string): HTMLAnchorElement {
  const link = document.createElement("a");
  link.className = "youglish";
  link.href = youglishHref(han, "chinese");
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Nghe người thật (YouGlish)";
  return link;
}

function reviewBlock(
  words: ReturnType<typeof reviewForDay>["words"],
  label: string,
): HTMLDetailsElement {
  const wrap = document.createElement("details");
  wrap.className = "review-block";
  wrap.open = true;
  wrap.setAttribute("aria-label", "Ôn 5 phút");
  const summary = document.createElement("summary");
  summary.textContent = "Ôn 5 phút";
  wrap.append(summary, textEl("p", label, "review-source"));

  const list = document.createElement("ul");
  list.className = "vocab-list review-list";
  for (const item of words) {
    const li = document.createElement("li");
    li.append(
      textEl("p", item.han, "han"),
      textEl("p", item.pinyin, "pinyin"),
      textEl("p", item.vi),
      actionRow(listenButton(item.han), youglishLink(item.han)),
    );
    const practice = writePracticePanel(item.han);
    if (practice) li.append(practice);
    list.append(li);
  }
  wrap.append(list);
  return wrap;
}

function vocabPanel(lesson: Lesson): HTMLElement {
  const list = document.createElement("ul");
  list.className = "vocab-list";
  for (const item of lesson.vocab) {
    const li = document.createElement("li");
    li.append(
      textEl("p", item.han, "han"),
      textEl("p", item.pinyin, "pinyin"),
      textEl("p", item.vi),
      textEl(
        "p",
        `${item.example.han} · ${item.example.pinyin} · ${item.example.vi}`,
        "example",
      ),
      actionRow(listenButton(item.han), youglishLink(item.han)),
    );
    const practice = writePracticePanel(item.han);
    if (practice) li.append(practice);
    list.append(li);
  }
  return list;
}

function grammarPanel(lesson: Lesson): HTMLElement {
  const wrap = document.createElement("div");
  wrap.append(
    textEl("h2", lesson.grammar.title),
    textEl("p", lesson.grammar.pattern, "pattern"),
    textEl("p", lesson.grammar.explainVi),
  );
  const drills = document.createElement("ol");
  for (const drill of lesson.grammar.drills) {
    const li = document.createElement("li");
    li.append(textEl("p", drill.prompt), hiddenAnswer(drill.answer));
    drills.append(li);
  }
  wrap.append(drills);
  if (lesson.exercises.length > 0) {
    const extra = document.createElement("ol");
    extra.className = "exercises";
    for (const ex of lesson.exercises) {
      const li = document.createElement("li");
      li.append(textEl("p", ex.prompt), hiddenAnswer(ex.answer));
      extra.append(li);
    }
    wrap.append(extra);
  }
  return wrap;
}

function talkPanel(lesson: Lesson): HTMLElement {
  const list = document.createElement("ol");
  list.className = "dialogue";
  for (const line of lesson.dialogue) {
    const li = document.createElement("li");
    li.append(
      textEl("p", line.speaker, "speaker"),
      textEl("p", line.han, "han"),
      textEl("p", line.pinyin, "pinyin"),
      textEl("p", line.vi),
      actionRow(listenButton(line.han)),
    );
    list.append(li);
  }
  return list;
}

function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => {
      fallbackCopy(text);
    });
  }
  fallbackCopy(text);
  return Promise.resolve();
}

function fallbackCopy(text: string): void {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.append(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

function aiPanel(lesson: Lesson): HTMLElement {
  const wrap = document.createElement("div");
  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "copy-prompt";
  copyBtn.textContent = "Sao chép prompt";
  const status = textEl("p", "", "copy-status");
  status.hidden = true;
  status.setAttribute("aria-live", "polite");

  copyBtn.addEventListener("click", () => {
    void copyText(lesson.aiPrompt.system).then(() => {
      status.textContent = "đã copy";
      status.hidden = false;
    });
  });

  wrap.append(
    textEl("p", lesson.aiPrompt.scenario),
    textEl("pre", lesson.aiPrompt.system, "prompt-box"),
    copyBtn,
    status,
  );
  return wrap;
}

function panelFor(tab: TabId, lesson: Lesson): HTMLElement {
  switch (tab) {
    case "vocab":
      return vocabPanel(lesson);
    case "grammar":
      return grammarPanel(lesson);
    case "talk":
      return talkPanel(lesson);
    case "ai":
      return aiPanel(lesson);
  }
}

export function renderLesson(day: number): HTMLElement {
  if (!Number.isInteger(day) || day < FIRST_DAY || day > LAST_DAY) {
    return textEl("h1", `Không có bài ngày ${day}`);
  }

  let lesson: Lesson;
  try {
    lesson = loadLesson(day);
  } catch {
    return textEl("h1", `Không có bài ngày ${day}`);
  }

  const section = document.createElement("section");
  section.className = "lesson";
  section.append(textEl("h1", `Ngày ${localDayOf(lesson.id)} — ${lesson.theme}`));

  let timer = createSessionTimer(lesson.timer);
  let lastBlockIndex = timer.blockIndex;

  const review = reviewForDay(lesson.id);
  const reviewEl =
    review.words.length > 0
      ? reviewBlock(review.words, review.label)
      : null;

  const timerWrap = document.createElement("div");
  timerWrap.className = "session-timer";
  timerWrap.setAttribute("aria-label", "Đồng hồ buổi học 30 phút");

  const phase = textEl("p", "", "timer-phase");
  const clock = textEl("p", formatClock(timer.remaining), "timer-clock");
  const head = document.createElement("div");
  head.className = "timer-head";
  head.append(phase, clock);

  const track = document.createElement("div");
  track.className = "timer-track";
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-label", "Tiến độ 30 phút");
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", "100");
  const fill = document.createElement("div");
  fill.className = "timer-fill";
  track.append(fill);

  const hint = textEl("p", "", "timer-hint");
  hint.hidden = true;
  hint.setAttribute("aria-live", "polite");

  const controls = document.createElement("div");
  controls.className = "timer-controls";
  const playBtn = document.createElement("button");
  playBtn.type = "button";
  playBtn.className = "timer-play";
  playBtn.textContent = "Bắt đầu";
  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "timer-reset";
  resetBtn.textContent = "Đặt lại";
  controls.append(playBtn, resetBtn);
  timerWrap.append(head, track, hint, controls);

  let current: TabId = "vocab";
  const tablist = document.createElement("div");
  tablist.className = "tabs";
  tablist.setAttribute("role", "tablist");
  const panel = document.createElement("div");
  panel.className = "tab-panel";
  panel.setAttribute("role", "tabpanel");

  const paintTabs = (): void => {
    for (const btn of tablist.querySelectorAll("button")) {
      const on = btn.dataset.tab === current;
      btn.setAttribute("aria-selected", on ? "true" : "false");
    }
    panel.replaceChildren(panelFor(current, lesson));
  };

  const showPhase = (id: BlockId): void => {
    if (id === "review") {
      if (reviewEl) reviewEl.open = true;
      return;
    }
    if (reviewEl) reviewEl.open = false;
    current = id;
    paintTabs();
  };

  const sessionDone = (): boolean =>
    timer.remaining === 0 && timer.blockIndex >= timer.blocks.length - 1;

  const paintTimer = (): void => {
    const block = timer.blocks[timer.blockIndex];
    const step = timer.blockIndex + 1;
    phase.textContent = `${PHASE_LABEL[block.id]} · bước ${step}/${timer.blocks.length}`;
    clock.textContent = formatClock(timer.remaining);
    const { done, total } = sessionElapsed(timer);
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    fill.style.width = `${pct}%`;
    track.setAttribute("aria-valuenow", String(pct));
    hint.textContent = timer.hint ?? "";
    hint.hidden = !timer.hint;
    playBtn.disabled = sessionDone();
    playBtn.textContent = timer.running ? "Tạm dừng" : "Bắt đầu";
    playBtn.classList.toggle("is-running", timer.running);
    const doneBtnNow = section.querySelector<HTMLButtonElement>(".complete-day");
    doneBtnNow?.classList.toggle("is-ready", sessionDone() && !doneBtnNow.disabled);
    if (timer.blockIndex !== lastBlockIndex) {
      lastBlockIndex = timer.blockIndex;
      showPhase(block.id);
    }
  };
  paintTimer();

  playBtn.addEventListener("click", () => {
    if (timer.running) {
      timer = pauseTimer(timer);
    } else {
      timer = startTimer(timer);
      showPhase(timer.blocks[timer.blockIndex].id);
    }
    paintTimer();
  });
  resetBtn.addEventListener("click", () => {
    timer = createSessionTimer(lesson.timer);
    lastBlockIndex = timer.blockIndex;
    showPhase(timer.blocks[0].id);
    paintTimer();
  });

  const tickId = window.setInterval(() => {
    if (!section.isConnected) {
      window.clearInterval(tickId);
      return;
    }
    if (!timer.running) return;
    timer = tickTimer(timer);
    paintTimer();
  }, 1000);

  section.append(timerWrap);
  if (reviewEl) section.append(reviewEl);

  for (const tab of TABS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.tab = tab.id;
    btn.textContent = tab.label;
    btn.setAttribute("role", "tab");
    btn.addEventListener("click", () => {
      current = tab.id;
      paintTabs();
    });
    tablist.append(btn);
  }

  section.append(tablist, panel);

  const doneBtn = document.createElement("button");
  doneBtn.type = "button";
  doneBtn.className = "complete-day";
  doneBtn.textContent = "Đánh dấu đã học";
  const doneStatus = textEl("p", "", "complete-status");
  doneStatus.setAttribute("aria-live", "polite");
  const paintDone = (): void => {
    const done = isDayComplete(lesson.id);
    doneBtn.disabled = done;
    doneStatus.textContent = done ? "Đã lưu" : "";
    doneStatus.hidden = !done;
  };
  doneBtn.addEventListener("click", () => {
    markDayComplete(lesson.id);
    paintDone();
  });
  paintDone();

  section.append(doneBtn, doneStatus, dayNav(lesson.id));
  paintTabs();
  return section;
}

function dayNav(day: number): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "day-nav";
  nav.setAttribute("aria-label", "Ngày trước sau");
  const hsk = hskOfDay(day);
  const first = firstDayOfHsk(hsk);
  const last = lastDayOfHsk(hsk);

  if (day > first) {
    const prev = document.createElement("a");
    prev.href = hrefDay(day - 1);
    prev.textContent = "Ngày trước";
    nav.append(prev);
  } else {
    const prev = document.createElement("span");
    prev.textContent = "Ngày trước";
    prev.setAttribute("aria-disabled", "true");
    nav.append(prev);
  }

  if (day < last) {
    const next = document.createElement("a");
    next.href = hrefDay(day + 1);
    next.textContent = "Ngày sau";
    nav.append(next);
  } else {
    const next = document.createElement("span");
    next.textContent = "Ngày sau";
    next.setAttribute("aria-disabled", "true");
    nav.append(next);
  }

  return nav;
}
