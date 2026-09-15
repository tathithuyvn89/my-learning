import { loadEnLesson } from "../en-content";
import {
  EN_SLOW_RATE,
  youglishHref,
  type EnLesson,
  type EnLine,
} from "../en-lesson";
import { reviewForEnDay } from "../en-review";
import {
  EN_FIRST_DAY,
  type EnCourse,
  hrefEnDay,
  lastEnDay,
} from "../course";
import { isEnDayComplete, markEnDayComplete } from "../progress";
import { canSpeak, listenButton, speakQueue } from "../speak";
import {
  EN_TIMER_HINTS,
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
  { id: "vocab", label: "Cụm nói" },
  { id: "grammar", label: "Nghe" },
  { id: "talk", label: "Hội thoại" },
  { id: "ai", label: "Prompt AI" },
];

const PHASE_LABEL: Record<BlockId, string> = {
  review: "Ôn bài",
  vocab: "Cụm nói",
  grammar: "Nghe",
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

function youglishLink(phrase: string): HTMLAnchorElement {
  const link = document.createElement("a");
  link.className = "youglish";
  link.href = youglishHref(phrase);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Nghe người thật (YouGlish)";
  return link;
}

function playLinesButton(
  lines: EnLine[],
  label: string,
  rate: number,
): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "talk-play";
  btn.textContent = label;
  if (!canSpeak()) {
    btn.disabled = true;
    btn.title = "Trình duyệt không hỗ trợ phát âm";
    return btn;
  }
  btn.addEventListener("click", () => {
    btn.classList.add("is-playing");
    speakQueue(
      lines.map((line) => line.en),
      "en-US",
      rate,
      () => {
        btn.classList.remove("is-playing");
      },
    );
  });
  return btn;
}

function reviewBlock(
  phrases: ReturnType<typeof reviewForEnDay>["phrases"],
  label: string,
): HTMLDetailsElement {
  const wrap = document.createElement("details");
  wrap.className = "review-block";
  wrap.open = true;
  wrap.setAttribute("aria-label", "Ôn 4 phút");
  const summary = document.createElement("summary");
  summary.textContent = "Ôn 4 phút";
  wrap.append(summary, textEl("p", label, "review-source"));
  wrap.append(
    textEl("p", "Nghe chậm rồi nói theo. Sau ngày 10 luôn có cụm xin nhắc.", "note"),
  );

  const list = document.createElement("ul");
  list.className = "vocab-list review-list";
  for (const item of phrases) {
    const li = document.createElement("li");
    li.append(
      textEl("p", item.en, "en-line"),
      textEl("p", item.note, "note"),
      textEl("p", item.vi),
      actionRow(
        listenButton(item.en, "en-US", EN_SLOW_RATE),
        youglishLink(item.en),
      ),
    );
    list.append(li);
  }
  wrap.append(list);
  return wrap;
}

function vocabPanel(lesson: EnLesson): HTMLElement {
  const wrap = document.createElement("div");
  const list = document.createElement("ul");
  list.className = "vocab-list";
  for (const item of lesson.phrases) {
    const li = document.createElement("li");
    li.append(
      textEl("p", item.en, "en-line"),
      textEl("p", item.note, "note"),
      textEl("p", item.vi),
      textEl("p", `${item.example.en} · ${item.example.vi}`, "example"),
    );
    if (item.slot) {
      li.append(textEl("p", `Việc thật: ${item.slot}`, "slot"));
    }
    li.append(
      actionRow(listenButton(item.en, "en-US"), youglishLink(item.en)),
    );
    list.append(li);
  }
  wrap.append(list);

  const pattern = document.createElement("div");
  pattern.className = "pattern-block";
  pattern.append(
    textEl("h2", lesson.pattern.title),
    textEl("p", lesson.pattern.pattern, "pattern"),
    textEl("p", lesson.pattern.explainVi),
  );
  const drills = document.createElement("ol");
  for (const drill of lesson.pattern.drills) {
    const li = document.createElement("li");
    li.append(textEl("p", drill.prompt), hiddenAnswer(drill.answer));
    drills.append(li);
  }
  pattern.append(drills);
  if (lesson.exercises.length > 0) {
    const extra = document.createElement("ol");
    extra.className = "exercises";
    for (const ex of lesson.exercises) {
      const li = document.createElement("li");
      li.append(textEl("p", ex.prompt), hiddenAnswer(ex.answer));
      extra.append(li);
    }
    pattern.append(extra);
  }
  wrap.append(pattern);
  return wrap;
}

function listenPanel(lesson: EnLesson): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "listen-panel";
  wrap.append(textEl("h2", lesson.listen.title));
  wrap.append(textEl("p", lesson.listen.methodVi, "listen-method"));

  if (lesson.listen.video) {
    const video = lesson.listen.video;
    const card = document.createElement("article");
    card.className = "listen-video";
    const link = document.createElement("a");
    link.href = video.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `Xem ${video.watchFrom}–${video.watchTo}: ${video.title}`;
    card.append(
      textEl("p", video.whyVi),
      link,
    );
    wrap.append(card);
  }

  wrap.append(textEl("h3", "Hội thoại lạ (ẩn chữ)"));
  const toolbar = document.createElement("div");
  toolbar.className = "talk-toolbar";
  toolbar.append(
    playLinesButton(lesson.listen.unseen, "Nghe cả đoạn", 1),
    playLinesButton(lesson.listen.unseen, "Nghe chậm 0.85x", EN_SLOW_RATE),
  );
  wrap.append(toolbar);

  const tasks = document.createElement("ol");
  tasks.className = "listen-tasks";
  for (const task of lesson.listen.tasks) {
    const li = document.createElement("li");
    li.append(textEl("p", task.prompt), hiddenAnswer(task.answer));
    tasks.append(li);
  }
  wrap.append(tasks);

  const fold = document.createElement("details");
  fold.className = "transcript-fold";
  const summary = document.createElement("summary");
  summary.textContent = "Hiện transcript (sau khi làm task)";
  fold.append(summary, lineList(lesson.listen.unseen, false));
  wrap.append(fold);
  return wrap;
}

function lineList(lines: EnLine[], hideVi: boolean): HTMLElement {
  const list = document.createElement("ol");
  list.className = hideVi ? "dialogue is-hide-vi" : "dialogue";
  for (const line of lines) {
    const li = document.createElement("li");
    li.append(
      textEl("p", line.speaker, "speaker"),
      textEl("p", line.en, "en-line"),
      textEl("p", line.vi, "vi-line"),
      actionRow(
        listenButton(line.en, "en-US"),
        listenButton(line.en, "en-US", EN_SLOW_RATE),
      ),
    );
    list.append(li);
  }
  return list;
}

function talkPanel(lesson: EnLesson): HTMLElement {
  const wrap = document.createElement("div");
  wrap.append(
    textEl(
      "p",
      "Shadow 3 lượt: nghe cả đoạn → nói theo → nói một mình vai A. Rồi mới copy AI.",
      "listen-method",
    ),
  );

  let hideVi = false;
  const listHost = document.createElement("div");
  const paintList = (): void => {
    listHost.replaceChildren(lineList(lesson.dialogue, hideVi));
  };

  const hideBtn = document.createElement("button");
  hideBtn.type = "button";
  hideBtn.className = "talk-play";
  hideBtn.setAttribute("aria-pressed", "false");
  const paintHide = (): void => {
    hideBtn.textContent = hideVi ? "Hiện tiếng Việt" : "Ẩn tiếng Việt";
    hideBtn.setAttribute("aria-pressed", hideVi ? "true" : "false");
    paintList();
  };
  hideBtn.addEventListener("click", () => {
    hideVi = !hideVi;
    paintHide();
  });

  const toolbar = document.createElement("div");
  toolbar.className = "talk-toolbar";
  toolbar.append(
    playLinesButton(lesson.dialogue, "Nghe cả đoạn", 1),
    playLinesButton(lesson.dialogue, "Chậm 0.85x", EN_SLOW_RATE),
    hideBtn,
  );
  wrap.append(toolbar, listHost);
  paintHide();
  return wrap;
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

function aiPanel(lesson: EnLesson): HTMLElement {
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
    textEl(
      "p",
      "Nói 8 lượt. Teammate được nói tiếng họp thật; bạn dùng cụm đã học và một chi tiết việc đang làm.",
      "listen-method",
    ),
    textEl("p", lesson.aiPrompt.scenario),
    textEl("pre", lesson.aiPrompt.system, "prompt-box"),
    copyBtn,
    status,
  );
  return wrap;
}

function panelFor(tab: TabId, lesson: EnLesson): HTMLElement {
  switch (tab) {
    case "vocab":
      return vocabPanel(lesson);
    case "grammar":
      return listenPanel(lesson);
    case "talk":
      return talkPanel(lesson);
    case "ai":
      return aiPanel(lesson);
  }
}

export function renderEnLesson(
  day: number,
  course: EnCourse = "it",
): HTMLElement {
  const last = lastEnDay(course);
  if (!Number.isInteger(day) || day < EN_FIRST_DAY || day > last) {
    return textEl("h1", `Không có bài ngày ${day}`);
  }

  let lesson: EnLesson;
  try {
    lesson = loadEnLesson(day, course);
  } catch {
    return textEl("h1", `Không có bài ngày ${day}`);
  }

  const section = document.createElement("section");
  section.className = "lesson";
  section.append(textEl("h1", `Ngày ${lesson.id} — ${lesson.theme}`));

  let timer = createSessionTimer(lesson.timer, EN_TIMER_HINTS);
  let lastBlockIndex = timer.blockIndex;

  const review = reviewForEnDay(lesson.id, course);
  const reviewEl =
    review.phrases.length > 0
      ? reviewBlock(review.phrases, review.label)
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
    timer = createSessionTimer(lesson.timer, EN_TIMER_HINTS);
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
    const done = isEnDayComplete(lesson.id, course);
    doneBtn.disabled = done;
    doneStatus.textContent = done ? "Đã lưu" : "";
    doneStatus.hidden = !done;
  };
  doneBtn.addEventListener("click", () => {
    markEnDayComplete(lesson.id, new Date(), course);
    paintDone();
  });
  paintDone();

  section.append(doneBtn, doneStatus, dayNav(lesson.id, course));
  paintTabs();
  return section;
}

function dayNav(day: number, course: EnCourse): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "day-nav";
  nav.setAttribute("aria-label", "Ngày trước sau");
  const last = lastEnDay(course);

  if (day > EN_FIRST_DAY) {
    const prev = document.createElement("a");
    prev.href = hrefEnDay(day - 1, course);
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
    next.href = hrefEnDay(day + 1, course);
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
