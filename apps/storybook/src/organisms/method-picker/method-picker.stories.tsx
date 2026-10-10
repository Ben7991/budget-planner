import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  MethodPicker,
  type BudgetMethodId,
} from "@repo/components/organisms/method-picker";

const meta = {
  title: "Organisms/MethodPicker",
  component: MethodPicker,
} satisfies Meta<typeof MethodPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<BudgetMethodId>("fifty_thirty_twenty");
    return (
      <div className="w-96">
        <MethodPicker value={value} onChange={setValue} />
      </div>
    );
  },
};
