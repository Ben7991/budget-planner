import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@repo/components/atoms/button"
import { AppShell } from "@repo/components/templates/app-shell"
import { requireAccount, fetchSessions } from "@/lib/server-account"
import { PageFallback } from "../../page-fallback"
import { SignOutButton } from "../../sign-out-button"
import { SessionsManager } from "./sessions-manager"

export default function SessionsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <SessionsContent />
    </Suspense>
  )
}

async function SessionsContent() {
  const account = await requireAccount()
  const { sessions } = await fetchSessions()

  return (
    <AppShell
      header={
        <>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{account.user.email}</span>
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
          </div>
          <SignOutButton />
        </>
      }
    >
      <SessionsManager sessions={sessions} />
    </AppShell>
  )
}
