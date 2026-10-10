import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthShell } from "@repo/components/templates/auth-shell";
import { CredentialsForm } from "@repo/components/organisms/credentials-form";

const meta = {
  title: "Templates/AuthShell",
  component: AuthShell,
} satisfies Meta<typeof AuthShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SignIn: Story = {
  render: () => (
    <AuthShell
      title="Sign in"
      description="Use the email and password for your budget."
      footer={<span className="text-sm">New here? Create an account.</span>}
    >
      <CredentialsForm submitLabel="Sign in" email="ada@example.com" />
    </AuthShell>
  ),
};
