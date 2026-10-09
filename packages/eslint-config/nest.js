import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

/**
 * NestJS config for a Node ESM API.
 * Type-aware rules read the app tsconfig, so pass that app's directory.
 *
 * @param {string} tsconfigRootDir
 * @returns {import("eslint").Linter.Config[]}
 */
export function nestJsConfig(tsconfigRootDir) {
  return tseslint.config(
    {
      ignores: ["dist/**", "coverage/**", "node_modules/**"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
      files: ["**/*.ts"],
      languageOptions: {
        globals: {
          ...globals.node,
        },
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-floating-promises": "error",
      },
    },
    {
      files: ["**/*spec.ts"],
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.vitest,
        },
      },
    },
  );
}
