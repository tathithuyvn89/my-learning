# Buổi học 30 phút

Mỗi bài chạy đúng 5 khối. Timer trên trang bài học bám các mốc này.

| Khối | Phút | Tab | Việc |
|------|------|-----|------|
| Ôn nhẹ | 5 | (đầu bài) | 5–8 từ hôm qua, nghe TTS một lần. Ngày 1 bỏ khối này hoặc rút từ mới. |
| Từ vựng | 8 | Từ vựng | 5–6 từ mới: Hán + pinyin + nghĩa Việt + 1 câu mẫu |
| Ngữ pháp | 8 | Ngữ pháp | 1 mẫu câu, 4 câu luyện, 2 câu tự viết |
| Hội thoại | 5 | Hội thoại | Dialog 4–6 câu, shadowing, đổi vai |
| Prompt AI | 4 | Prompt AI | Copy prompt đã khoá từ, nói 3–5 lượt với AI bên ngoài |

Ngày 6–7 mỗi tuần: không thêm từ mới. Dồn thời gian vào hội thoại + AI.

## Prompt AI

Mỗi JSON bài học có `aiPrompt`:

- `scenario`: tình huống tiếng Việt, 1–2 câu.
- `system`: system prompt copy được. Bắt buộc:
  - vai: bạn nói tiếng Trung HSK 1
  - chỉ dùng danh sách từ của bài này + các bài trước
  - mỗi lượt 1–2 câu, Hán + pinyin
  - sai thì sửa nhẹ bằng tiếng Việt rồi hỏi lại
  - không thêm từ mới

Ví dụ ngày 1:

```
Bạn là bạn nói tiếng Trung trình độ HSK 1. Chỉ dùng các từ: 你好, 您, 谢谢, 不客气, 请, 我, 你. Mỗi lượt 1–2 câu ngắn. Viết Hán + pinyin. Nếu học viên sai, sửa nhẹ bằng tiếng Việt rồi hỏi lại. Không thêm từ mới. Bắt đầu bằng: 你好！
```
