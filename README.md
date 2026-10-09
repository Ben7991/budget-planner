# The Budget Planner

Monorepo for a personal budget planner. What the product should do is written in [docs/product-spec.md](docs/product-spec.md). That spec is the source of truth for future work, including what ships now, next, and later.

## Apps

| App | Path | Role |
| --- | --- | --- |
| Web | [apps/web](apps/web) | Next.js client. Dev server defaults to port 3000. |
| API | [apps/api](apps/api) | NestJS HTTP API. Dev server defaults to port 3001. Swagger UI is at `/docs`. |

Shared TypeScript and ESLint config lives in `packages/`.

## Scripts

From the repo root:

```bash
npm install
npm run dev    # web and API together
npm run build
npm run lint
```
