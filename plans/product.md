# Sản phẩm

Web tĩnh để học tiếng Trung **30 phút/ngày**, trình độ tương đương **HSK 1 rồi HSK 2 rồi HSK 3 rồi HSK 4 rồi HSK 5 rồi HSK 6** (chữ giản thể, pinyin, khoảng 970 từ core).

## Mục tiêu người dùng

- Mở site, học đúng bài của ngày, xong trong 30 phút.
- Mỗi bài đủ bốn phần: từ vựng, ngữ pháp, hội thoại, prompt nói với AI.
- AI bị khoá vocabulary: chỉ dùng từ đã học đến bài đó.

## Quyết định đã chốt

- Giao diện: tiếng Việt.
- Chữ: giản thể. Không phồn thể ở bản 1.
- Thời lượng khoá: 48 tuần = 336 bài. Tuần 8, 16, 24, 32, 40 và 48 chỉ ôn, không thêm từ mới.
- Không backend, không tài khoản.
- Tiến độ: `localStorage`.
- Âm thanh bản 1: Web Speech API `zh-CN` (không file audio).
- AI bản 1: prompt copy (ChatGPT / Claude / Cursor). Không nhúng API key.

## Phạm vi không làm (bản 1)

- Đăng nhập, server, database.
- API AI trong site.
- PWA, tài khoản đám mây, đồng bộ nhiều máy.
