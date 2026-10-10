"use client"

import { Button } from "@repo/components/atoms/button"
import { PasswordField } from "@repo/components/molecules/password-field"
import { TextField } from "@repo/components/molecules/text-field"

function CredentialsForm({
  email = "",
  password = "",
  emailError,
  passwordError,
  formError,
  submitLabel = "Continue",
  passwordAutoComplete = "current-password",
  pending = false,
  onEmailChange = () => {},
  onPasswordChange = () => {},
  onSubmit = () => {},
}: {
  email?: string
  password?: string
  emailError?: string
  passwordError?: string
  formError?: string
  submitLabel?: string
  passwordAutoComplete?: "current-password" | "new-password"
  pending?: boolean
  onEmailChange?: (value: string) => void
  onPasswordChange?: (value: string) => void
  onSubmit?: () => void
}) {
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        error={emailError}
        onChange={(event) => onEmailChange(event.target.value)}
      />
      <PasswordField
        label="Password"
        autoComplete={passwordAutoComplete}
        value={password}
        error={passwordError}
        onChange={(event) => onPasswordChange(event.target.value)}
      />
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Please wait" : submitLabel}
      </Button>
    </form>
  )
}

export { CredentialsForm }
