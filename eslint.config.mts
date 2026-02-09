import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import path from "path";

const tsconfigRootDir = path.resolve(".");

export default defineConfig([
  {
    ignores: ["dist/**", "**/dist/**",
  "src/migrations/**",
      "src/seeders/**",
      "**/migrations/**",
      "**/seeders/**",
],
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
        "no-multiple-empty-lines": [
      "error",
      {
        "max": 1,
        "maxEOF": 0,
        "maxBOF": 0
      }
    ],

    "no-trailing-spaces": "error",
    "no-irregular-whitespace": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);
