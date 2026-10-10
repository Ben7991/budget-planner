import type { Meta, StoryObj } from "@storybook/react-vite";
import { WizardShell } from "@repo/components/templates/wizard-shell";
import { MethodPicker } from "@repo/components/organisms/method-picker";

const meta = {
  title: "Templates/WizardShell",
  component: WizardShell,
} satisfies Meta<typeof WizardShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MethodStep: Story = {
  render: () => (
    <WizardShell step="Step 1 of 3" title="How do you want to budget?">
      <MethodPicker value="envelopes" />
    </WizardShell>
  ),
};
