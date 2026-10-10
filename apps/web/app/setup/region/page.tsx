import { redirect } from "next/navigation"
import { Suspense } from "react"
import { AuthShell } from "@repo/components/templates/auth-shell"
import { setupPath } from "@/lib/account"
import { fetchSuggestion, requireAccount } from "@/lib/server-account"
import { PageFallback } from "../../page-fallback"
import { RegionSetupForm } from "./region-setup-form"

export default function RegionPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <RegionContent />
    </Suspense>
  )
}

async function RegionContent() {
  const account = await requireAccount()
  if (account.profile.locale && account.profile.baseCurrency) {
    redirect(setupPath(account) ?? "/")
  }

  const suggestion = await fetchSuggestion()

  return (
    <AuthShell
      title="Confirm your region"
      description="We suggested a locale and currency. Change either one before saving."
    >
      <RegionSetupForm
        suggestedLocale={suggestion.locale}
        suggestedCurrency={suggestion.currency}
      />
    </AuthShell>
  )
}
