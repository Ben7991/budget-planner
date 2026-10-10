import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "@repo/components/molecules/text-field";

const meta = {
  title: "Molecules/TextField",
  component: TextField,
  args: {
    label: "Email",
    placeholder: "you@example.com",
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: "Enter a valid email.", defaultValue: "not-an-email" },
};
