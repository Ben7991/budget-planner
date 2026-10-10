import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

import { TEST_DATABASE_URL } from './vitest.global-setup';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    fileParallelism: false,
    globalSetup: ['./vitest.global-setup.ts'],
    env: {
      DATABASE_URL: TEST_DATABASE_URL,
    },
  },
});
