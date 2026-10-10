import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordField } from "@repo/components/molecules/password-field";

const meta = {
  title: "Molecules/PasswordField",
  component: PasswordField,
  args: {
    label: "Password",
    defaultValue: "correct-horse",
  },
} satisfies Meta<typeof PasswordField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: "Use at least 8 characters.", defaultValue: "short" },
};
