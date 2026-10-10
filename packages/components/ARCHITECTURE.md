# Component package architecture

Source of truth for where new UI in `@repo/components` goes. Follow this when adding a component. Do not invent a new folder layout.

`@repo/components` owns reusable UI. Pages, route handlers, data fetching, and budget math stay in `apps/web` and `apps/api`.

## Layers

Each layer is a folder under `src/`. A layer may import from itself or from any layer below it. It does not import from a layer above it, and it does not import from an app.

| Layer | Folder | What belongs here | Examples |
| --- | --- | --- | --- |
| Atoms | `src/atoms` | One primitive. No other UI component inside it. | Button, input, label, badge |
| Molecules | `src/molecules` | A few atoms with one job. | Text field, money input, category select |
| Organisms | `src/organisms` | A section of the product UI. | Transaction row, budget category card, account summary |
| Templates | `src/templates` | Layout shells with slots. No live data. | App shell, budget page frame |

Button lives at `src/atoms/button/`. shadcn primitives are atoms. The shadcn `ui` alias points at `@repo/components/atoms`.

## One folder per component

The folder name is kebab-case. The component file and the named export are PascalCase.

```
src/atoms/button/
  button.tsx
  index.ts
```

`index.ts` re-exports the public component:

```ts
export { Button, buttonVariants } from "./button"
```

Import it as `@repo/components/atoms/button`. The same pattern applies to molecules, organisms, and templates: `@repo/components/molecules/text-field`.

`@repo/components` holds React components, `index.ts` re-exports, and shared `lib` or `hooks` only. Do not put story files in this package.

The matching story lives in the Storybook app at the same relative path. `packages/components/src/atoms/button/button.tsx` is covered by `apps/storybook/src/atoms/button/button.stories.tsx`. Storybook titles follow the layer: `Atoms/Button`, `Molecules/TextField`, `Organisms/TransactionRow`, `Templates/AppShell`.

## Wiring

`package.json` exports each layer, for example `"./atoms/*": "./src/atoms/*/index.ts"`. `components.json` sets the shadcn `ui` alias to `@repo/components/atoms`. `tsconfig.json` maps each layer the same way. Storybook loads stories from `apps/storybook/src`. `apps/storybook/src/library.stories.tsx` globs `atoms`, `molecules`, `organisms`, and `templates` in this package.

## Choosing a layer

1. If it renders one control and contains no other component from this package, it is an atom.
2. If it composes atoms into a single field or control group, it is a molecule.
3. If it is a recognizable block of a budget screen, it is an organism.
4. If it only arranges regions and accepts children or slots, it is a template.
5. If it is a route, fetches data, or runs budget calculations, it does not belong in this package.
