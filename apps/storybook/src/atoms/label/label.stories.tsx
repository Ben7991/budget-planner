import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "@repo/components/atoms/label";

const meta = {
  title: "Atoms/Label",
  component: Label,
  args: { children: "Email" },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
