import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TEST_DATABASE_URL =
  'postgresql://budget:budget@localhost:5432/budget_planner_test';

export default function setup() {
  const root = path.dirname(fileURLToPath(import.meta.url));
  execSync('npx prisma migrate deploy', {
    cwd: root,
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: 'inherit',
  });
}
