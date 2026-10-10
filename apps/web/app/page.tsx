import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@repo/components/atoms/button"
import { AppShell } from "@repo/components/templates/app-shell"
import { formatMinor, methodLabel, setupPath } from "@/lib/account"
import { requireAccount } from "@/lib/server-account"
import { PageFallback } from "./page-fallback"
import { SignOutButton } from "./sign-out-button"

export default function Home() {
  return (
    <Suspense fallback={<PageFallback />}>
      <HomeContent />
    </Suspense>
  )
}

async function HomeContent() {
  const account = await requireAccount()
  const next = setupPath(account)
  if (next) {
    redirect(next)
  }

  const { profile, goal, user } = account

  return (
    <AppShell
      header={
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium">{user.email}</span>
            <Button variant="ghost" asChild>
              <Link href="/account/sessions">Sessions</Link>
            </Button>
            {profile.onboardingStatus === "skipped" ? (
              <Button variant="outline" asChild>
                <Link href="/setup">Finish setup</Link>
              </Button>
            ) : null}
          </div>
          <SignOutButton />
        </>
      }
    >
      <div className="grid gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p>
          Base currency {profile.baseCurrency}. Locale {profile.locale}.
        </p>
        {profile.budgetMethod ? (
          <p>Budget method {methodLabel(profile.budgetMethod)}.</p>
        ) : (
          <p>Setup is still open whenever you want it.</p>
        )}
        {goal && profile.locale && profile.baseCurrency ? (
          <p>
            Goal {goal.name},{" "}
            {formatMinor(goal.targetAmount, profile.baseCurrency, profile.locale)}{" "}
            by {goal.targetDate}.
          </p>
        ) : null}
      </div>
    </AppShell>
  )
}
