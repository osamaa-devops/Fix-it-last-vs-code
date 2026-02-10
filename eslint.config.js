import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      ".next",
      ".expo"
    ]
  },
  {
    files: [
      "**/*.{js,jsx,ts,tsx}"
    ],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    rules: {
      "no-console": [
        "warn",
        {
          allow: [
            "warn",
            "error"
          ]
        }
      ],
      "no-unused-vars": "off"
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommended
];
