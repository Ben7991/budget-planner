import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@repo/components/atoms/input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  args: {
    placeholder: "Amount",
    "aria-label": "Amount",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "12.5" },
};
