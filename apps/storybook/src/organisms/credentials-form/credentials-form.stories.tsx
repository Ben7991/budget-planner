import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CredentialsForm } from "@repo/components/organisms/credentials-form";

const meta = {
  title: "Organisms/CredentialsForm",
  component: CredentialsForm,
  args: { submitLabel: "Sign in" },
} satisfies Meta<typeof CredentialsForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [email, setEmail] = useState("ada@example.com");
    const [password, setPassword] = useState("");
    return (
      <div className="w-80">
        <CredentialsForm
          {...args}
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
        />
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    email: "ada@example.com",
    password: "wrong",
    formError: "Email or password is incorrect",
  },
};
