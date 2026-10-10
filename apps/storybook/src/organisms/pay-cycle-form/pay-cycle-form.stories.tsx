import type { Meta, StoryObj } from "@storybook/react-vite";
import { PayCycleForm } from "@repo/components/organisms/pay-cycle-form";

const meta = {
  title: "Organisms/PayCycleForm",
  component: PayCycleForm,
  args: { payCycle: "biweekly", nextPayDate: "2026-10-16" },
} satisfies Meta<typeof PayCycleForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
