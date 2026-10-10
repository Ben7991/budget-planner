import type { Meta, StoryObj } from "@storybook/react-vite";
import { GoalForm } from "@repo/components/organisms/goal-form";

const meta = {
  title: "Organisms/GoalForm",
  component: GoalForm,
  args: {
    name: "Emergency fund",
    amount: "1500.00",
    targetDate: "2027-01-01",
  },
} satisfies Meta<typeof GoalForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
