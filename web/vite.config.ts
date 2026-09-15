import { defineConfig } from "vite";

export default defineConfig({
  // Đường dẫn tương đối: GitHub Pages (kể cả /repo/) và Netlify đều chạy được.
  base: "./",
  define: {
    "import.meta.env.VITE_VERCEL_BUILD": JSON.stringify(
      process.env.VERCEL === "1" ? "1" : "0",
    ),
  },
});
