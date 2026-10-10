"use client"

import { useState } from "react"
import { RegionForm } from "@repo/components/organisms/region-form"
import { readError } from "@/lib/account"

export function RegionSetupForm({
  suggestedLocale,
  suggestedCurrency,
}: {
  suggestedLocale: string
  suggestedCurrency: string
}) {
  const [locale, setLocale] = useState(suggestedLocale)
  const [currency, setCurrency] = useState(suggestedCurrency)
  const [formError, setFormError] = useState<string>()
  const [pending, setPending] = useState(false)

  return (
    <RegionForm
      locale={locale}
      currency={currency}
      formError={formError}
      pending={pending}
      onLocaleChange={setLocale}
      onCurrencyChange={setCurrency}
      onSubmit={() => {
        setPending(true)
        setFormError(undefined)
        void fetch("/api/me/region", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ locale, baseCurrency: currency }),
        })
          .then(async (response) => {
            if (!response.ok) {
              setFormError(await readError(response))
              setPending(false)
              return
            }
            window.location.assign("/setup")
          })
          .catch(() => {
            setFormError("Something went wrong. Try again.")
            setPending(false)
          })
      }}
    />
  )
}
