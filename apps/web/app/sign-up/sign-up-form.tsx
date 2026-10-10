"use client"

import { useState } from "react"
import { CredentialsForm } from "@repo/components/organisms/credentials-form"
import { readError } from "@/lib/account"

export function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState<string>()
  const [pending, setPending] = useState(false)

  return (
    <CredentialsForm
      email={email}
      password={password}
      formError={formError}
      submitLabel="Create account"
      passwordAutoComplete="new-password"
      pending={pending}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={() => {
        setPending(true)
        setFormError(undefined)
        void fetch("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
          .then(async (response) => {
            if (!response.ok) {
              setFormError(await readError(response))
              setPending(false)
              return
            }
            window.location.assign("/setup/region")
          })
          .catch(() => {
            setFormError("Something went wrong. Try again.")
            setPending(false)
          })
      }}
    />
  )
}
