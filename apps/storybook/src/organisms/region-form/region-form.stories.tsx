import type { Meta, StoryObj } from "@storybook/react-vite";
import { RegionForm } from "@repo/components/organisms/region-form";

const meta = {
  title: "Organisms/RegionForm",
  component: RegionForm,
  args: { locale: "en-GB", currency: "GBP" },
} satisfies Meta<typeof RegionForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Suggested: Story = {};
