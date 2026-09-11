export function canSpeak(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance === "function"
  );
}

export function speakZh(text: string): SpeechSynthesisUtterance | null {
  if (!canSpeak()) return null;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "zh-CN";
    window.speechSynthesis.speak(utter);
    return utter;
  } catch {
    // Trình duyệt không hỗ trợ: không crash.
    return null;
  }
}

const SPEAKER_SVG = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M3 10v4h3.2L11 18.8V5.2L6.2 10H3Zm11.5-1.1v6.2a4.6 4.6 0 0 0 0-6.2ZM16.8 5.8v12.4a7.4 7.4 0 0 0 0-12.4Z"
    />
  </svg>
`;

let playingBtn: HTMLButtonElement | null = null;

export function listenButton(han: string): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "listen";
  btn.innerHTML = SPEAKER_SVG;
  btn.setAttribute("aria-label", `Nghe ${han}`);
  btn.title = "Nghe";
  if (!canSpeak()) {
    btn.disabled = true;
    btn.title = "Trình duyệt không hỗ trợ phát âm";
    return btn;
  }
  btn.addEventListener("click", () => {
    if (playingBtn && playingBtn !== btn) {
      playingBtn.classList.remove("is-playing");
    }
    const utter = speakZh(han);
    if (!utter) return;
    playingBtn = btn;
    btn.classList.add("is-playing");
    const stop = (): void => {
      if (playingBtn === btn) playingBtn = null;
      btn.classList.remove("is-playing");
    };
    utter.addEventListener("end", stop, { once: true });
    utter.addEventListener("error", stop, { once: true });
  });
  return btn;
}
