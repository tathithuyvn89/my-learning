export function canSpeak(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance === "function"
  );
}

function utterance(
  text: string,
  lang: string,
  rate: number,
): SpeechSynthesisUtterance {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = rate;
  return utter;
}

export function speak(
  text: string,
  lang = "zh-CN",
  rate = 1,
): SpeechSynthesisUtterance | null {
  if (!canSpeak()) return null;
  try {
    window.speechSynthesis.cancel();
    const utter = utterance(text, lang, rate);
    window.speechSynthesis.speak(utter);
    return utter;
  } catch {
    return null;
  }
}

export function speakZh(text: string): SpeechSynthesisUtterance | null {
  return speak(text, "zh-CN");
}

export function speakEn(text: string): SpeechSynthesisUtterance | null {
  return speak(text, "en-US");
}

export function speakQueue(
  texts: string[],
  lang = "en-US",
  rate = 1,
  onDone?: () => void,
): boolean {
  if (!canSpeak() || texts.length === 0) {
    onDone?.();
    return false;
  }
  try {
    window.speechSynthesis.cancel();
    let index = 0;
    const playNext = (): void => {
      if (index >= texts.length) {
        onDone?.();
        return;
      }
      const utter = utterance(texts[index], lang, rate);
      utter.addEventListener(
        "end",
        () => {
          index += 1;
          playNext();
        },
        { once: true },
      );
      utter.addEventListener(
        "error",
        () => {
          onDone?.();
        },
        { once: true },
      );
      window.speechSynthesis.speak(utter);
    };
    playNext();
    return true;
  } catch {
    onDone?.();
    return false;
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

export function listenButton(
  text: string,
  lang = "zh-CN",
  rate = 1,
): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "listen";
  btn.innerHTML = SPEAKER_SVG;
  btn.setAttribute(
    "aria-label",
    rate < 1 ? `Nghe chậm ${text}` : `Nghe ${text}`,
  );
  btn.title = rate < 1 ? "Nghe chậm" : "Nghe";
  if (!canSpeak()) {
    btn.disabled = true;
    btn.title = "Trình duyệt không hỗ trợ phát âm";
    return btn;
  }
  btn.addEventListener("click", () => {
    if (playingBtn && playingBtn !== btn) {
      playingBtn.classList.remove("is-playing");
    }
    const utter = speak(text, lang, rate);
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
