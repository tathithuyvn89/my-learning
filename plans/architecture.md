# Kiến trúc site tĩnh

## Stack

- Vite + TypeScript, app nằm trong `web/`
- HTML/CSS, không framework
- Hash router (`#/`, `#/day/1`, …) để GitHub Pages / Netlify không cần rewrite
- Test: Vitest. Lint: ESLint. Lệnh theo `AGENTS.md`: trong `web/`, `npm test`, `npm run lint`

## Trang

| Màn | Route | Việc |
|-----|-------|------|
| Hôm nay | `#/` | Bài gợi ý, streak, nút bắt đầu 30 phút |
| Lịch | `#/calendar` | 224 ô: xong / hôm nay / chưa học |
| Bài học | `#/day/:n` | 4 tab + timer + TTS + copy prompt |
| Sổ từ | `#/words` | Gộp từ mọi JSON, lọc tuần, nghe |
| Tiến độ | `#/progress` | Streak, % tuần, bài chưa xong |

## Nội dung

Mỗi bài một file: `web/content/days/001.json` … `224.json`. UI không hardcode từ vựng / hội thoại.

### Schema `Lesson`

```ts
type Lesson = {
  id: number;          // 1–224
  week: number;        // 1–32
  hsk: 1 | 2 | 3 | 4;
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
```

Load qua `loadLesson(n)`. Test fail nếu thiếu field bắt buộc.

## Tiến độ

`localStorage` key thống nhất, ví dụ `hsk1-progress`:

```ts
type Progress = {
  completedDays: number[];
  lastCompletedAt: string; // ISO date
  streak: number;
};
```

Không khoá ngày tương lai: học vượt được. Streak đếm ngày lịch liên tiếp.

## Âm thanh

`speechSynthesis.speak` với `lang = "zh-CN"`. Nếu trình duyệt không hỗ trợ: ẩn hoặc disable nút nghe, không crash.
