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
| Lịch | `#/calendar` | 56 ô mỗi cấp HSK: xong / hôm nay / chưa học |
| Bài học | `#/day/:n` | 4 tab + timer + TTS + copy prompt |
| Sổ từ | `#/words` | Gộp từ mọi JSON, lọc tuần, nghe, YouGlish (Hán, `chinese/cn`) |
| Tiến độ | `#/progress` | Streak, % tuần, bài chưa xong |

## Nội dung

Mỗi bài một file: `web/content/days/001.json` … `336.json`. UI không hardcode từ vựng / hội thoại.

### Schema `Lesson`

```ts
type Lesson = {
  id: number;          // 1–336
  week: number;        // 1–48
  hsk: 1 | 2 | 3 | 4 | 5 | 6;
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

## Tìm kiếm (SEO)

`index.html` có title, description, Open Graph, canonical, JSON-LD (`WebApplication` + `Course`). Mỗi lần đổi hash, `applySeo` cập nhật title/description. `web/public/robots.txt` và `sitemap.xml` trỏ GitHub Pages `https://tathithuyvn89.github.io/my-learning/` — đổi URL đó nếu deploy chỗ khác. Hash route không nằm trong sitemap (crawler coi fragment là một trang).

## Âm thanh

`speechSynthesis.speak` với `lang = "zh-CN"` (HSK) hoặc `lang = "en-US"` (Tiếng Anh IT). Tiếng Anh có `rate` chậm (0.85) để shadow. Từ/cụm có link YouGlish (HSK: Hán tự, `/chinese/cn`; Anh: `/english`); hội thoại chỉ TTS. Nếu trình duyệt không hỗ trợ: ẩn hoặc disable nút nghe, không crash.

## Track Tiếng Anh

Hai khóa nghe–nói, nhịp **30 phút**. Không dùng field `han` / `pinyin`. Khối timer `grammar` trên track EN = **Nghe** (8 phút); mẫu câu gộp vào tab Cụm nói. `EnCourse = "it" | "iv"`.

Menu Trung / Anh: sidebar trái (≥900px), drawer trái trên điện thoại. HSK 1–6 nằm dưới mục Trung. Anh: **IT** (`#/en`) và **Phỏng vấn** (`#/en/iv`).

### IT — 30 ngày

Curriculum: `plans/curriculum-en-it.md`. Load `loadEnLesson(n)` hoặc `loadEnLesson(n, "it")`. Tiến độ `en-it-progress`.

| Màn | Route | Việc |
|-----|-------|------|
| Hôm nay | `#/en` | Bài gợi ý, streak IT, bắt đầu 30 phút |
| Lịch | `#/en/calendar` | 30 ô |
| Bài học | `#/en/day/:n` | Cụm nói / Nghe / Hội thoại / Prompt AI |
| Sổ cụm | `#/en/words` | Gộp cụm IT, lọc tuần, nghe `en-US`, YouGlish |
| Tiến độ | `#/en/progress` | Streak IT, % 30 ngày |

### Phỏng vấn — 21 ngày

Học sau IT (ít nhất tuần 4). Curriculum: `plans/curriculum-en-iv.md`. Load `loadEnLesson(n, "iv")`. Tiến độ `en-iv-progress` (không trộn streak IT). `id` 1–21, `week` 1–3. Cùng schema `EnLesson`.

| Màn | Route | Việc |
|-----|-------|------|
| Hôm nay | `#/en/iv` | Bài gợi ý, streak IV, bắt đầu 30 phút |
| Lịch | `#/en/iv/calendar` | 21 ô |
| Bài học | `#/en/iv/day/:n` | Cụm nói / Nghe / Hội thoại / Prompt AI |
| Sổ cụm | `#/en/iv/words` | Gộp cụm IV, lọc tuần |
| Tiến độ | `#/en/iv/progress` | Streak IV, % 21 ngày |

`#/en/day/31` và `#/en/iv/day/0|22` → không tìm thấy.

### Schema `EnLesson`

```ts
type EnLesson = {
  id: number;          // IT 1–30 · IV 1–21
  week: number;        // IT 1–5 · IV 1–3
  theme: string;
  kind: "learn" | "review";
  phrases: Array<{
    en: string;
    note: string;
    vi: string;
    example: { en: string; vi: string };
    slot?: string;     // khung điền việc thật
  }>;
  pattern: {
    title: string;
    pattern: string;
    explainVi: string;
    drills: Array<{ prompt: string; answer: string }>;
  };
  listen: {
    title: string;
    video: {
      title: string;
      url: string;
      watchFrom: string;
      watchTo: string;
      whyVi: string;
    } | null;
    unseen: Array<{ speaker: "A" | "B"; en: string; vi: string }>;
    tasks: Array<{ type: "gist" | "cloze" | "repair"; prompt: string; answer: string }>;
    methodVi: string;
  };
  dialogue: Array<{ speaker: "A" | "B"; en: string; vi: string }>;
  exercises: Array<{ type: string; prompt: string; answer: string }>;
  aiPrompt: {
    scenario: string;
    system: string;
    allowedPhrases: string[];
    turns: number;
  };
  timer: { review: 4; vocab: 5; grammar: 8; talk: 8; ai: 5 };
};
```

Load qua `loadEnLesson(n, course?)` (`course` mặc định `"it"`). Tiến độ `en-it-progress` / `en-iv-progress` (tách HSK và tách nhau).

