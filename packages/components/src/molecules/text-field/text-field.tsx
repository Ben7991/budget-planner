import * as React from "react"
import { Input } from "@repo/components/atoms/input"
import { Label } from "@repo/components/atoms/label"

function TextField({
  id,
  label,
  error,
  ...props
}: React.ComponentProps<"input"> & {
  label: string
  error?: string
}) {
  const generatedId = React.useId()
  const fieldId = id ?? generatedId
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <div className="grid gap-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <Input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export { TextField }
