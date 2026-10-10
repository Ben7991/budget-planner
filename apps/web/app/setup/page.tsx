import { redirect } from "next/navigation"
import { Suspense } from "react"
import { requireAccount } from "@/lib/server-account"
import { PageFallback } from "../page-fallback"
import { SetupWizard } from "./setup-wizard"

export default function SetupPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <SetupContent />
    </Suspense>
  )
}

async function SetupContent() {
  const account = await requireAccount()
  if (!account.profile.locale || !account.profile.baseCurrency) {
    redirect("/setup/region")
  }
  if (account.profile.onboardingStatus === "complete") {
    redirect("/")
  }

  return <SetupWizard currency={account.profile.baseCurrency} />
}
