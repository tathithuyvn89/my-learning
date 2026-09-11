# Học tiếng Trung HSK 1–4

Web tĩnh, 30 phút/ngày, 224 bài / 32 tuần (HSK 1 rồi HSK 2 rồi HSK 3 rồi HSK 4). Giao diện tiếng Việt, chữ giản thể, pinyin. Không tài khoản, không API AI — tiến độ lưu trên máy (`localStorage`), prompt copy ra ChatGPT/Claude.

App nằm trong thư mục `web/`. Điều hướng dùng **hash** (`#/`, `#/day/1`, …) nên GitHub Pages và Netlify không cần rewrite.

## Chạy local

Cần Node.js 18+.

```bash
cd web
npm install
npm run dev
```

Mở [http://localhost:5173/](http://localhost:5173/). TTS tiếng Trung ổn hơn trên Chrome hoặc Edge.

```bash
cd web
npm test
npm run lint
```

## Build

```bash
cd web
npm run build
```

Thư mục xuất: `web/dist/`. Xem trước bản build:

```bash
cd web
npm run preview
```

Hash vẫn phải chạy: `#/`, `#/calendar`, `#/words`, `#/day/2`, `#/day/56`, `#/day/57`, `#/day/112`, `#/hsk3`, `#/day/113`, `#/day/168`, `#/hsk4`, `#/day/169`, `#/day/224`.

## Deploy — GitHub Pages

`base: "./"` trong `web/vite.config.ts` nên site chạy được cả khi URL có tên repo (`https://user.github.io/ten-repo/`).

**Cách nhanh (Actions):** Settings → Pages → Source: **GitHub Actions**. Workflow mẫu: build trong `web/`, publish `web/dist`.

```yaml
# .github/workflows/pages.yml (tự thêm nếu dùng Actions)
name: Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    environment:
      name: github-pages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: web/package-lock.json
      - run: npm ci && npm run build
        working-directory: web
      - uses: actions/upload-pages-artifact@v3
        with:
          path: web/dist
      - uses: actions/deploy-pages@v4
```

**Cách kéo thư mục:** `npm run build` rồi đưa nội dung `web/dist` lên nhánh `gh-pages` (không đẩy `index.html` lên root repo nếu bạn chưa cấu hình Pages trỏ vào `dist`).

Sau khi lên: mở `…/#/day/1` — F5 không được mất trang.

## Deploy — Netlify

- **Base directory:** `web`
- **Build command:** `npm run build`
- **Publish directory:** `dist`

Hoặc kéo thả thư mục `web/dist` vào [Netlify Drop](https://app.netlify.com/drop). Không cần file `_redirects` vì hash router.
