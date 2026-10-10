import type { Meta, StoryObj } from "@storybook/react-vite";
import { SessionList } from "@repo/components/organisms/session-list";

const meta = {
  title: "Organisms/SessionList",
  component: SessionList,
  args: {
    sessions: [
      {
        id: "current",
        userAgent: "Chrome on Linux",
        createdAt: "2026-10-10T06:00:00.000Z",
        current: true,
      },
      {
        id: "other",
        userAgent: "Firefox on Linux",
        createdAt: "2026-10-09T12:00:00.000Z",
        current: false,
      },
    ],
  },
} satisfies Meta<typeof SessionList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
