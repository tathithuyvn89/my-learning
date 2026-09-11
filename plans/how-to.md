# Cách làm — hướng dẫn từng buổi

Hai nhịp: **thủ công** (một bước / buổi) hoặc **điều phối** (`plans/run-through.md`: mỗi bước một agent mới, không nhét 1→13 vào một chat).

Không dùng loop 5 phút trong cùng chat — context vẫn phình. Daily Triage (L1) để nguyên.

Trạng thái hiện tại: `plans/status.md`.

## Chuẩn bị một lần

1. Mở repo này trong Cursor.
2. Đọc `plans/status.md` — nhớ số bước đang đứng.
3. Không chạy `/loop`, không bảo agent sửa `LOOP.md` cho plan này.
4. Daily Triage (L1) để nguyên: chỉ báo cáo, không xây app.

Cần cài: Node.js (18+), trình duyệt Chrome hoặc Edge (TTS tiếng Trung ổn hơn Safari).

## Một buổi = một bước

Làm đúng 5 nhịp:

1. Mở chat mới (hoặc chat cũ nếu còn ngắn). Tag `@plans/implement.md` và `@plans/status.md`.
2. Dán **lời gọi bước** (mẫu dưới). Đổi `N` thành số trong `status.md`.
3. Để agent code. Không nói “làm luôn bước sau”.
4. **Bạn** chạy checklist của bước đó. Agent xong chưa đủ — “Xong khi” là do bạn xác nhận.
5. Nếu đạt: bảo agent cập nhật `plans/status.md`, rồi **dừng**. Buổi sau mới bước N+1.

Nếu chưa đạt: nhắn “chưa đạt vì …” + một câu. Không nhảy bước.

## Lời gọi bước (copy)

```
Đọc plans/README.md, plans/implement.md (bước N), plans/architecture.md,
và plans/status.md.

Chỉ implement bước N. Dừng ngay khi đạt mục "Xong khi" của bước đó.
Không làm bước N+1, không refactor ngoài file ghi trong bước N,
không thêm HSK 2 / API AI / tài khoản.

Nếu đã có script: chạy npm test và npm run lint, sửa cho xanh.
Khi xong: nói rõ file đã đụng và cách tôi kiểm tra. Đừng tự sửa plans/status.md
trừ khi tôi bảo "đánh dấu bước N xong".
```

Lần đầu tiên, `N` = `1`.

Lời đánh dấu xong:

```
Bước N đã đạt "Xong khi". Cập nhật plans/status.md (bước hiện tại = N+1).
Không implement thêm.
```

Lời chặn nếu agent làm quá đà:

```
Dừng. Revert phần không thuộc bước N. Chỉ giữ đúng bước đang làm.
```

## Việc bạn làm (không giao cho loop)

| Khi | Bạn làm |
|-----|---------|
| Sau mỗi bước | Chạy checklist bên dưới |
| Bước có UI (3, 7–13, 15–16, 19–21) | Mở trình duyệt, bấm thật, không chỉ nhìn screenshot |
| Bước 5, 12, 17, 18 (JSON) | Đọc Hán + pinyin + nghĩa; sai thì bảo sửa từng bài |
| Bước 11 | Copy prompt, dán ChatGPT/Claude, thử 3 lượt |
| Trước commit | Chỉ commit khi bạn yêu cầu |

## Checklist theo bước

Chạy lệnh trong thư mục `web/`. Dev server: `npm run dev` (sau bước 1).

### Bước 1

- [ ] `npm run dev` lên được
- [ ] Trình duyệt hiện tiêu đề **Học tiếng Trung HSK 1**

### Bước 2

- [ ] `npm test` xanh
- [ ] `npm run lint` xanh

### Bước 3

- [ ] Click Hôm nay / Lịch / Sổ từ / Tiến độ
- [ ] URL dạng `#/`, `#/calendar`, `#/words`, `#/progress`, `#/day/1`
- [ ] F5 vẫn đúng trang

### Bước 4

- [ ] Mở `web/src/lesson.ts`: đủ field như `plans/architecture.md`

### Bước 5

- [ ] Mở `web/content/days/001.json`
- [ ] 5–6 từ chào hỏi (你好 …), dialog ≥4 câu, `timer` 5/8/8/5/4
- [ ] `aiPrompt.system` chỉ liệt kê từ ngày 1

### Bước 6

- [ ] `npm test` — `loadLesson(1)` pass
- [ ] Xoá thử một field bắt buộc (rồi hoàn tác): test phải fail

### Bước 7

- [ ] Trang `#/` hiện chủ đề ngày 1
- [ ] Nút **Bắt đầu 30 phút** đi tới `#/day/1`

### Bước 8

- [ ] Bốn tab: Từ vựng, Ngữ pháp, Hội thoại, Prompt AI
- [ ] Chữ trên tab khớp `001.json`, không gõ cứng trong HTML

### Bước 9

- [ ] Thanh 5 khối 5+8+8+5+4
- [ ] Bắt đầu / tạm dừng / reset
- [ ] Hết một khối có gợi ý đổi tab

### Bước 10

- [ ] Nút nghe trên từ và câu hội thoại
- [ ] Có tiếng Trung (Chrome/Edge)

### Bước 11

- [ ] Sao chép prompt → dán chat AI → AI chỉ dùng từ đã khoá

**Cột mốc P0a:** ngồi học thử ngày 1 đủ 30 phút.

### Bước 12

- [ ] Có `002.json` … `007.json`
- [ ] `npm test` xanh
- [ ] Ngày 6–7 không nhồi từ mới

### Bước 13

- [ ] Từ ngày 1 đi tới 7
- [ ] Không vào được ngày 0 hoặc 8
- [ ] F5 trên `#/day/4` vẫn ngày 4

**Cột mốc P0b:** đi hết tuần 1 trên browser.

### Bước 14–16

- [ ] 14: Xong bài → F5 vẫn đánh dấu
- [ ] 15: Streak hiện trên Hôm nay
- [ ] 16: Lịch 56 ô, click vào bài được, ngày tương lai không bị khoá

**Cột mốc P1:** streak + lịch đúng sau một bài hoàn thành.

### Bước 17–21

- [ ] 17–18: JSON pass test; tuần 8 không thêm từ mới; bạn duyệt vài bài ngẫu nhiên
- [ ] 19: Sổ từ lọc tuần, nghe được
- [ ] 20: Bài ngày 2 hiện từ ngày 1 ở khối ôn
- [ ] 21: `npm run build` rồi `npm run preview`; hash route vẫn chạy

## Nhịp đề xuất

- Buổi 30–45 phút: **một** bước (1, 2, 4, 6, 11, 14 ổn).
- Buổi dài hơn: vẫn một bước nếu là 8, 9, 16 (UI).
- JSON tuần 2–8 (17, 18): tách “làm 7 ngày rồi dừng, tôi duyệt” — đừng nhét 21 file một lượt nếu bạn chưa đọc.

Làm 3–4 buổi/tuần thì P0 (bước 1–13) khoảng 2–3 tuần lịch, không phải 2–3 tuần học tiếng Trung.

## Khi nào mới nghĩ tới loop

Chỉ sau **cột mốc P0b** (tuần 1 chạy trên browser) và `npm test` đã xanh.

Khi đó loop (nếu có) chỉ L1: báo bước hiện tại + test đỏ/xanh. Không để loop tự viết Hán hay merge.

Daily Triage hiện tại **không** dùng để đẩy `implement.md`.
