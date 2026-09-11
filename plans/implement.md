# Thứ tự implement — 21 bước, làm lần lượt

Không làm song song các bước phụ thuộc nhau. Mỗi bước một thay đổi nhỏ. Xong điều kiện “Xong khi” mới sang bước tiếp.

P0 = bước 1–13 (học được tuần 1). P1 = 14–16. P2–P3 = 17–21.

## A. Nền tảng

### 1. Khởi tạo Vite + TypeScript

- File: `web/package.json`, `web/index.html`, `web/src/main.ts`, `web/src/styles.css`, `web/vite.config.ts`, `web/tsconfig.json`
- Phụ thuộc: —
- Xong khi: `npm run dev` mở được trang có tiêu đề “Học tiếng Trung HSK 1”.

### 2. Lint + test theo AGENTS.md

- File: `web/eslint.config.js`, `web/vitest.config.ts`, `web/src/smoke.test.ts`
- Phụ thuộc: 1
- Xong khi: `npm test` và `npm run lint` chạy xanh trên skeleton.

### 3. Hash router + layout tiếng Việt

- File: `web/src/router.ts`, `web/src/layout.ts`, `web/src/pages/home.ts`
- Phụ thuộc: 1
- Xong khi: Nav Hôm nay / Lịch / Sổ từ / Tiến độ. URL `#/`, `#/calendar`, `#/words`, `#/progress`, `#/day/1` đổi trang; F5 không mất.

## B. Dữ liệu

### 4. Khoá schema bài học

- File: `web/src/lesson.ts`
- Phụ thuộc: 2
- Xong khi: type `Lesson` khớp `plans/architecture.md` (id, week, vocab[], grammar, dialogue[], exercises[], aiPrompt, timer).

### 5. Viết bài ngày 1 (JSON đầy đủ)

- File: `web/content/days/001.json`
- Phụ thuộc: 4
- Xong khi: đủ 5–6 từ, 1 mẫu ngữ pháp, dialog ≥4 câu, prompt AI khoá từ, timer 5/8/8/5/4. Nội dung theo ngày 1 trong `plans/curriculum.md`.

### 6. Load JSON + test schema

- File: `web/src/content.ts`, `web/src/content.test.ts`
- Phụ thuộc: 5
- Xong khi: `loadLesson(1)` trả về ngày 1. Test fail nếu thiếu field bắt buộc.

## C. Học được ngày 1

### 7. Trang Hôm nay — CTA vào bài 1

- File: `web/src/pages/home.ts`
- Phụ thuộc: 3, 6
- Xong khi: hiện chủ đề ngày 1, nút “Bắt đầu 30 phút” → `#/day/1`.

### 8. Trang bài học: 4 tab render JSON

- File: `web/src/pages/lesson.ts`
- Phụ thuộc: 7
- Xong khi: tab Từ vựng / Ngữ pháp / Hội thoại / Prompt AI đọc `001.json`. Không hardcode nội dung bài trong UI.

### 9. Đồng hồ 30 phút, 5 khối

- File: `web/src/timer.ts`, `web/src/pages/lesson.ts`
- Phụ thuộc: 8
- Xong khi: thanh 5 khối 5+8+8+5+4. Bấm bắt đầu đếm. Hết khối gợi ý đổi tab. Pause/reset được.

### 10. Phát âm zh-CN

- File: `web/src/speak.ts`
- Phụ thuộc: 8
- Xong khi: mỗi từ và mỗi câu hội thoại có nút nghe. `speechSynthesis`, `lang=zh-CN`. Không crash nếu trình duyệt không hỗ trợ.

### 11. Copy prompt AI

- File: `web/src/pages/lesson.ts`
- Phụ thuộc: 8
- Xong khi: nút Sao chép prompt. Clipboard chứa `aiPrompt.system`. Hiện “đã copy”.

Cột mốc P0a: làm hết 30 phút ngày 1 trên trình duyệt (4 tab + timer + nghe + copy prompt).

## D. Tuần 1 đủ

### 12. Nội dung ngày 2–7

- File: `web/content/days/002.json` … `007.json`
- Phụ thuộc: 6
- Xong khi: 7 file JSON pass schema test. Ngày 6–7 là ôn, không nhồi từ mới. Bám `plans/curriculum.md` tuần 1.

### 13. Điều hướng ngày trước / sau

- File: `web/src/pages/lesson.ts`, `web/src/pages/home.ts`
- Phụ thuộc: 8, 12
- Xong khi: đi ngày 1→7 được. Ngày 0 và 8 bị chặn. Home mở được `#/day/n`.

Cột mốc P0b: đi ngày 1→7, F5 vẫn đúng bài.

## E. Tiến độ

### 14. localStorage: hoàn thành bài

- File: `web/src/progress.ts`, `web/src/progress.test.ts`
- Phụ thuộc: 13
- Xong khi: nút “Xong bài” lưu `{ completedDays, lastCompletedAt }`. F5 vẫn còn. Test không đụng DOM.

### 15. Streak trên trang Hôm nay

- File: `web/src/progress.ts`, `web/src/pages/home.ts`
- Phụ thuộc: 14
- Xong khi: hiện chuỗi ngày liên tiếp. Bỏ 1 ngày thì streak về 0. Gợi ý bài tiếp theo chưa xong.

### 16. Lịch 56 ô

- File: `web/src/pages/calendar.ts`
- Phụ thuộc: 14, 13
- Xong khi: 56 ngày: xong / hôm nay / chưa học. Click vào bài được. Không khoá ngày tương lai (học vượt được).

Cột mốc P1: đánh dấu xong, thấy streak, lịch 56 ô.

## F. Đủ 8 tuần + deploy

### 17. Nội dung tuần 2–4 (ngày 8–28)

- File: `web/content/days/008.json` … `028.json`
- Phụ thuộc: 12
- Xong khi: 21 bài pass schema. Chủ đề: thời gian, gia đình, ăn uống (`plans/curriculum.md`).

### 18. Nội dung tuần 5–8 (ngày 29–56)

- File: `web/content/days/029.json` … `056.json`
- Phụ thuộc: 17
- Xong khi: 28 bài pass schema. Tuần 8 không thêm từ mới. Prompt AI tuần 8 khoá ~150 từ.

### 19. Sổ từ sinh từ JSON

- File: `web/src/pages/words.ts`, `web/src/vocab-index.ts`
- Phụ thuộc: 18, 10
- Xong khi: danh sách gộp mọi ngày, lọc theo tuần, bấm nghe. Không nhập từ tay lần hai.

### 20. Khối ôn 5 phút = từ hôm qua

- File: `web/src/pages/lesson.ts`, `web/src/review.ts`
- Phụ thuộc: 15, 19
- Xong khi: đầu mỗi bài (trừ ngày 1) hiện 5–8 từ ngày trước. Ngày ôn cuối tuần lấy từ cả tuần.

### 21. Build tĩnh + hướng dẫn deploy

- File: `web/vite.config.ts` (base), `README.md`
- Phụ thuộc: 16, 20
- Xong khi: `npm run build` ra `dist/`. Preview hash route vẫn chạy. README: GitHub Pages / Netlify.

Cột mốc cuối: 56 bài chạy trên bản build tĩnh.

## Không nhét vào bước 1–21

Tài khoản, API AI trong site, chữ phồn, HSK 2, PWA.
