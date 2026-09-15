import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", "content/days/gen-*.mjs", "content/en/gen-*.mjs", "content/en-iv/gen-*.mjs"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
);
