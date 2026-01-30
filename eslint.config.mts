import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import path from "path";

const tsconfigRootDir = path.resolve(".");

export default defineConfig([
  {
    ignores: ["dist/**", "**/dist/**"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ignores: ["dist/**", "**/dist/**"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir,
      },
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);
