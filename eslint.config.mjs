import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/android/**",
      "**/ios/**",
      "**/generated/**",
      "**/.expo/**",
      "apps/mobile/**",
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.strict,
  eslintConfigPrettier,
);
