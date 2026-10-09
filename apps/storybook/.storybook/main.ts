import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Resolve a package from this workspace. Required in a monorepo so Storybook
 * does not pick up a nested copy of an addon.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
  ],
  framework: getAbsolutePath("@storybook/react-vite"),
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    config.server ??= {};
    config.server.fs ??= {};
    config.server.fs.allow = [...(config.server.fs.allow ?? []), repoRoot];
    return config;
  },
};

export default config;
