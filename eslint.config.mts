import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import path from "path";
import globals from "globals";

const tsconfigRootDir = path.resolve(".");

export default defineConfig([

  /*
  |--------------------------------------------------------------------------
  | Ignore Build & Generated Files
  |--------------------------------------------------------------------------
  */
  {
    ignores: [
      "dist/**",
      "**/dist/**",
      "node_modules/**",
      "coverage/**",
      "src/migrations/**",
      "src/seeders/**",
      "**/migrations/**",
      "**/seeders/**",
          "src/config/config.js",
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | Base Recommended Rules
  |--------------------------------------------------------------------------
  */
  js.configs.recommended,
  ...tseslint.configs.recommended,

  /*
  |--------------------------------------------------------------------------
  | Node + Express Environment
  |--------------------------------------------------------------------------
  */
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Type-Aware Linting
  |--------------------------------------------------------------------------
  */
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir,
      },
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Project Rules
  |--------------------------------------------------------------------------
  */
  {
    files: ["**/*.{ts,tsx,js,jsx}"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir,
      },
    },

    rules: {

      /*
      |--------------------------------------------------------------------------
      | 🔥 Core JavaScript Safety
      |--------------------------------------------------------------------------
      */
      "no-console": "warn",
      "no-debugger": "warn",
      "no-alert": "warn",
      "no-var": "warn",
      "prefer-const": "warn",
      "eqeqeq": ["warn", "always"],
      "curly": ["warn", "all"],
      "no-duplicate-imports": "warn",
      "no-unreachable": "warn",
      "no-return-await": "off",
      "no-useless-catch": "off",
      "no-useless-return": "warn",
      "no-shadow": "off",
      "no-unused-vars": "off",

      /*
      |--------------------------------------------------------------------------
      | 🧼 Strict Spacing & Formatting
      |--------------------------------------------------------------------------
      */
      "indent": ["error", 2],
      "no-multi-spaces": "error",
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": [
        "error",
        { max: 1, maxEOF: 0, maxBOF: 0 }
      ],
      "no-irregular-whitespace": "warn",
      "eol-last": ["warn", "always"],
      "object-shorthand": "warn",
      "prefer-template": "warn",
      "no-else-return": ["warn", { allowElseIf: false }],
      "no-lonely-if": "warn",
      "no-nested-ternary": "error",
      "no-unneeded-ternary": "error",

      "space-before-blocks": "error",
      "brace-style": ["error", "1tbs", { allowSingleLine: false }],
      "key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "keyword-spacing": ["error", { before: true, after: true }],
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "space-in-parens": ["error", "never"],
      "object-curly-spacing": ["error", "always"],
      "space-infix-ops": "error",
      "comma-spacing": ["error", { before: false, after: true }],
      "arrow-spacing": ["error", { before: true, after: true }],

      /*
      |--------------------------------------------------------------------------
      | 🛡 TypeScript Safety
      |--------------------------------------------------------------------------
      */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",

      /*
      |--------------------------------------------------------------------------
      | 🚨 Complexity Control
      |--------------------------------------------------------------------------
      */
      "complexity": ["warn", 10],
      "max-depth": ["warn", 4],
      "max-nested-callbacks": ["warn", 3],
      "max-params": ["warn", 4],
      "max-lines-per-function": ["warn", 80],
    },
  },
]);
