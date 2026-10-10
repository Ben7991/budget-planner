"use client"

import { Button } from "@repo/components/atoms/button"
import { TextField } from "@repo/components/molecules/text-field"

function RegionForm({
  locale = "",
  currency = "",
  localeError,
  currencyError,
  formError,
  pending = false,
  onLocaleChange = () => {},
  onCurrencyChange = () => {},
  onSubmit = () => {},
}: {
  locale?: string
  currency?: string
  localeError?: string
  currencyError?: string
  formError?: string
  pending?: boolean
  onLocaleChange?: (value: string) => void
  onCurrencyChange?: (value: string) => void
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
        label="Locale"
        value={locale}
        error={localeError}
        autoComplete="off"
        onChange={(event) => onLocaleChange(event.target.value)}
      />
      <TextField
        label="Base currency"
        value={currency}
        error={currencyError}
        autoComplete="off"
        maxLength={3}
        onChange={(event) => onCurrencyChange(event.target.value.toUpperCase())}
      />
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Please wait" : "Confirm"}
      </Button>
    </form>
  )
}

export { RegionForm }
