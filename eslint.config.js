import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y"; // Accessibility for JSX
import prettierPlugin from "eslint-plugin-prettier"; // Prettier integration
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs}"], // JavaScript and JSX files
    plugins: {
      next: nextPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      prettier: prettierPlugin, // Integrate Prettier plugin
    },
    rules: {
      // Next.js rules
      "next/core-web-vitals": "off", // Adjusted to warn for better performance tracking

      // Import rules
      "import/first": "error", // Ensure imports are at the top
      "import/newline-after-import": "error", // Ensure a newline after imports
      "import/no-duplicates": "error", // Prevent duplicate imports
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // React rules
      "react/react-in-jsx-scope": "off", // Not required in Next.js (automatically handled)
      "react/prop-types": "off", // Disable prop-types since you're likely using TypeScript (or not using them)
      "react/jsx-no-duplicate-props": "error", // Prevent duplicate props
      "react/jsx-key": "error", // Ensure keys are used in lists
      "react-hooks/rules-of-hooks": "error", // Verify Hooks rules
      "react-hooks/exhaustive-deps": "warn", // Verify dependencies of useEffect

      // Accessibility rules
      "jsx-a11y/alt-text": "warn", // Ensure alt text for images
      "jsx-a11y/anchor-is-valid": "warn", // Validate <a> usage
      "jsx-a11y/no-noninteractive-element-interactions": "warn", // Avoid interactive handlers on non-interactive elements

      // General JavaScript rules
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Allow unused args with `_`
      "no-console": ["warn", { allow: ["warn", "error"] }], // Allow warn/error
      quotes: ["error", "double"], // Enforce double quotes
      semi: ["error", "always"], // Enforce semicolons
      indent: ["error", 2], // Enforce consistent indentation

      // Code quality rules
      eqeqeq: ["error", "always"], // Require strict equality
      curly: ["error", "all"], // Enforce consistent use of curly braces
      "arrow-body-style": ["error", "as-needed"], // Enforce concise arrow functions
      "prefer-const": "error", // Suggest using `const` where possible
      "no-var": "error", // Disallow `var` in favor of `let` and `const`

      // Prettier Integration
      "prettier/prettier": "error", // Show Prettier issues as ESLint errors
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        document: "readonly",
        navigator: "readonly",
        window: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  },
];
