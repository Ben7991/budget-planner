import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { AuthShell } from "@repo/components/templates/auth-shell"
import { setupPath } from "@/lib/account"
import { fetchAccount } from "@/lib/server-account"
import { PageFallback } from "../page-fallback"
import { SignInForm } from "./sign-in-form"

export default function SignInPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <SignInContent />
    </Suspense>
  )
}

async function SignInContent() {
  const account = await fetchAccount()
  if (account) {
    redirect(setupPath(account) ?? "/")
  }

  return (
    <AuthShell
      title="Sign in"
      description="Use the email and password for your budget."
      footer={
        <p className="text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/sign-up" className="font-medium text-foreground underline">
            Create an account
          </Link>
        </p>
      }
    >
      <SignInForm />
    </AuthShell>
  )
}
