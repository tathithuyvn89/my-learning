import { HSK_LEVELS, type HskLevel } from "../course";
import {
  type OnboardKind,
  completeOnboarding,
  findUser,
  snapshotFromProgress,
} from "../progress";

type OnboardOptions = {
  onDone: (hash: string) => void;
};

function field(
  labelText: string,
  control: HTMLElement,
  hint?: string,
): HTMLElement {
  const wrap = document.createElement("label");
  wrap.className = "onboard-field";
  const label = document.createElement("span");
  label.textContent = labelText;
  wrap.append(label, control);
  if (hint) {
    const p = document.createElement("p");
    p.className = "onboard-hint";
    p.textContent = hint;
    wrap.append(p);
  }
  return wrap;
}

function parseHsk(value: string): HskLevel {
  const n = Number(value);
  return HSK_LEVELS.includes(n as HskLevel) ? (n as HskLevel) : 1;
}

export function openOnboardDialog(options: OnboardOptions): void {
  if (document.querySelector(".onboard-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "onboard-overlay";
  overlay.setAttribute("role", "presentation");

  const dialog = document.createElement("form");
  dialog.className = "onboard-card";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "onboard-title");

  const title = document.createElement("h2");
  title.id = "onboard-title";
  title.textContent = "Bắt đầu học";

  const lead = document.createElement("p");
  lead.className = "onboard-lead";
  lead.textContent =
    "Nhập tên và mã học viên để lưu tiến độ trên máy này.";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.name = "name";
  nameInput.required = true;
  nameInput.autocomplete = "name";
  nameInput.maxLength = 80;
  nameInput.placeholder = "Ví dụ: Thủy";

  const idInput = document.createElement("input");
  idInput.type = "text";
  idInput.name = "userId";
  idInput.required = true;
  idInput.autocomplete = "username";
  idInput.maxLength = 40;
  idInput.placeholder = "Ví dụ: thuy01";

  const foundNote = document.createElement("p");
  foundNote.className = "onboard-found";
  foundNote.hidden = true;

  const kindSet = document.createElement("fieldset");
  kindSet.className = "onboard-kind";
  const legend = document.createElement("legend");
  legend.textContent = "Bạn là học viên nào?";
  kindSet.append(legend);

  const newLabel = document.createElement("label");
  const newRadio = document.createElement("input");
  newRadio.type = "radio";
  newRadio.name = "kind";
  newRadio.value = "new";
  newRadio.checked = true;
  newLabel.append(newRadio, document.createTextNode(" Học viên mới"));

  const oldLabel = document.createElement("label");
  const oldRadio = document.createElement("input");
  oldRadio.type = "radio";
  oldRadio.name = "kind";
  oldRadio.value = "existing";
  oldLabel.append(oldRadio, document.createTextNode(" Đã học rồi"));
  kindSet.append(newLabel, oldLabel);

  const existingBox = document.createElement("div");
  existingBox.className = "onboard-existing";
  existingBox.hidden = true;

  const hskSelect = document.createElement("select");
  hskSelect.name = "hsk";
  for (const level of HSK_LEVELS) {
    const opt = document.createElement("option");
    opt.value = String(level);
    opt.textContent = `HSK ${level}`;
    hskSelect.append(opt);
  }

  const dayInput = document.createElement("input");
  dayInput.type = "number";
  dayInput.name = "localDay";
  dayInput.min = "0";
  dayInput.max = "56";
  dayInput.value = "0";
  dayInput.required = true;

  existingBox.append(
    field("Bạn đang học HSK nào?", hskSelect),
    field(
      "Đã hoàn thành đến ngày nào của cấp đó?",
      dayInput,
      "0 = chưa xong ngày nào của cấp này. Các bài trước đó sẽ được đánh dấu xong.",
    ),
  );

  const error = document.createElement("p");
  error.className = "onboard-error";
  error.setAttribute("role", "alert");
  error.hidden = true;

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "cta";
  submit.textContent = "Bắt đầu học";

  const close = (): void => {
    overlay.remove();
    document.removeEventListener("keydown", onKey);
  };

  const paintKind = (): void => {
    const existing = oldRadio.checked;
    existingBox.hidden = !existing;
    dayInput.required = existing;
    submit.textContent = existing ? "Xác nhận và tiếp tục" : "Bắt đầu học";
  };

  const applyFoundUser = (): void => {
    const record = findUser(idInput.value);
    if (!record) {
      foundNote.hidden = true;
      return;
    }
    foundNote.hidden = false;
    foundNote.textContent = `Đã tìm thấy mã ${record.userId} trên máy này. Xác nhận HSK và ngày đã học.`;
    oldRadio.checked = true;
    if (!nameInput.value.trim()) nameInput.value = record.name;
    const snap = snapshotFromProgress(record.progress);
    hskSelect.value = String(snap.hsk);
    dayInput.value = String(snap.localDay);
    paintKind();
  };

  const onKey = (event: KeyboardEvent): void => {
    if (event.key === "Escape") close();
  };

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener("keydown", onKey);

  newRadio.addEventListener("change", paintKind);
  oldRadio.addEventListener("change", paintKind);
  idInput.addEventListener("blur", applyFoundUser);

  dialog.addEventListener("submit", (event) => {
    event.preventDefault();
    error.hidden = true;
    const name = nameInput.value.trim();
    const userId = idInput.value.trim();
    if (!name || !userId) {
      error.textContent = "Hãy nhập tên và mã học viên.";
      error.hidden = false;
      return;
    }
    const record = findUser(userId);
    const kind: OnboardKind =
      oldRadio.checked || record ? "existing" : "new";
    if (record && kind === "existing") {
      oldRadio.checked = true;
      paintKind();
    }
    try {
      const result = completeOnboarding({
        name,
        userId,
        kind,
        hsk: parseHsk(hskSelect.value),
        localDay: Number(dayInput.value),
      });
      close();
      options.onDone(result.hash);
    } catch {
      error.textContent = "Không lưu được. Thử lại nhé.";
      error.hidden = false;
    }
  });

  dialog.append(
    title,
    lead,
    field("Tên của bạn", nameInput),
    field("Mã học viên", idInput),
    foundNote,
    kindSet,
    existingBox,
    error,
    submit,
  );
  overlay.append(dialog);
  document.body.append(overlay);
  nameInput.focus();
  paintKind();
}
