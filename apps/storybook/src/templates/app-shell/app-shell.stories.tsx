import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@repo/components/atoms/button";
import { AppShell } from "@repo/components/templates/app-shell";

const meta = {
  title: "Templates/AppShell",
  component: AppShell,
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Home: Story = {
  render: () => (
    <AppShell
      header={
        <>
          <span className="text-sm font-medium">ada@example.com</span>
          <Button variant="outline" type="button">
            Sign out
          </Button>
        </>
      }
    >
      <h1 className="text-2xl font-semibold">Welcome back</h1>
    </AppShell>
  ),
};
