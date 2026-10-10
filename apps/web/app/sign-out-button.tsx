"use client"

import { Button } from "@repo/components/atoms/button"

export function SignOutButton() {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        void fetch("/api/auth/logout", { method: "POST" }).finally(() => {
          window.location.assign("/sign-in")
        })
      }}
    >
      Sign out
    </Button>
  )
}
