import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/components/atoms/card";

const meta = {
  title: "Atoms/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Emergency fund</CardTitle>
        <CardDescription>Target 1,500.00</CardDescription>
      </CardHeader>
      <CardContent>Saved this month.</CardContent>
    </Card>
  ),
};
