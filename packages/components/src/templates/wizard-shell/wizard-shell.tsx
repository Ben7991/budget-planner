"use client"

import type { ReactNode } from "react"
import { Button } from "@repo/components/atoms/button"

function WizardShell({
  step = "Setup",
  title = "Get started",
  children,
  onBack,
  onSkip = () => {},
  onContinue = () => {},
  continueLabel = "Continue",
  continueDisabled = false,
}: {
  step?: ReactNode
  title?: ReactNode
  children?: ReactNode
  onBack?: () => void
  onSkip?: () => void
  onContinue?: () => void
  continueLabel?: string
  continueDisabled?: boolean
}) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-10">
      <div className="grid gap-1">
        <p className="text-sm text-muted-foreground">{step}</p>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      <div>{children}</div>
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" onClick={onSkip}>
          Skip
        </Button>
        <div className="flex gap-2">
          {onBack ? (
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          ) : null}
          <Button type="button" onClick={onContinue} disabled={continueDisabled}>
            {continueLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { WizardShell }
