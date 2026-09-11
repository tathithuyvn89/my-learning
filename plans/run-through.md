# Làm hết — bộ nhớ mới mỗi bước + song song khi được

Không nhét bước 1→13 vào **một** chat. Context sẽ đầy (code, test log, JSON). Loop **cùng phiên** cũng đầy — mỗi tick còn nhớ 12 bước trước.

Quy tắc: **một bước = một agent mới**. Chat điều phối chỉ giữ `plans/status.md` và 1–2 dòng “bước n xong”.

## Cách A — điều phối + agent mới (nên dùng)

Chat này (hoặc chat “orchestrator”) **không viết app**. Mỗi bước:

1. Đọc `plans/status.md` → số bước `N`.
2. Mở **agent/chat mới** (hoặc subagent), prompt chỉ bước `N` (mẫu `plans/how-to.md`).
3. Agent con xong → test xanh → cập nhật `status.md` → **vứt context con**.
4. Agent điều phối sang bước tiếp (hoặc sang wave song song).

Dừng P0 khi `status` bước hiện tại = **14** (đã xong 13).

Bạn không cần gửi 13 prompt. Chỉ cần một lần: **orchestrator P0**.

## Cách B — loop (cẩn thận)

Loop chỉ ổn nếu **mỗi tick là agent mới** (SDK `Agent.prompt` one-shot, hoặc Cloud Agent mới), đọc `status.md`, làm 1 bước, thoát.

Loop `/loop 5m` **trong chat đang mở** = cùng memory → không giải được context.

Không tick 5 phút khi bước trước chưa xong (chồng file). Tick sau chỉ chạy khi bước trước đã ghi `status.md`.

## Song song — chỉ theo wave

Không “21 bước cùng lúc”. Chỉ song song khi **không đụng cùng file**.

```
Wave 1:  1
Wave 2:  2 ║ 3          (2 = lint/test, 3 = router; ít chồng file)
Wave 3:  4
Wave 4:  5
Wave 5:  6
Wave 6:  7 ║ 12         (home vs JSON ngày 2–7)
Wave 7:  8
Wave 8:  10 rồi 9 rồi 11
         (cả 9 và 11 sửa lesson.ts — không song song cùng worktree)
Wave 9:  13             (cần 8 và 12)
```

`║` = hai agent cùng lúc được. Wave 8 phải tuần tự vì chung `web/src/pages/lesson.ts`.

Hai agent song song: worktree riêng hoặc file hoàn toàn khác. Cùng nhánh, cùng `lesson.ts` → conflict.

## Việc bạn vẫn làm

Sau wave 7–8: `npm run dev`, học thử ngày 1 (P0a).  
Sau wave 9: đi ngày 1→7 (P0b).

JSON Hán (bước 5, 12) điều phối không “duyệt hộ”; bạn đọc nhanh 001 và 006/007 khi P0 xong.
