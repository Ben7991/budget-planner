import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType, ReactNode } from "react";

type UiModule = Record<string, unknown>;

const uiModules = import.meta.glob<UiModule>(
  "../../../packages/components/src/ui/*.tsx",
  { eager: true },
);

const components = Object.entries(uiModules)
  .flatMap(([, mod]) =>
    Object.entries(mod).flatMap(([name, value]) => {
      if (!/^[A-Z]/.test(name) || typeof value !== "function") {
        return [];
      }

      return [
        {
          name,
          Component: value as ComponentType<{ children?: ReactNode }>,
        },
      ];
    }),
  )
  .sort((a, b) => a.name.localeCompare(b.name));

const meta = {
  title: "Components/Library",
  parameters: {
    docs: {
      description: {
        component:
          "Every component exported from @repo/components. A new file in packages/components/src/ui appears here on the next load.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {components.map(({ name, Component }) => (
        <section key={name} className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">{name}</h2>
          <Component>{name}</Component>
        </section>
      ))}
    </div>
  ),
};
