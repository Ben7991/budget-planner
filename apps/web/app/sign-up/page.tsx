import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { AuthShell } from "@repo/components/templates/auth-shell"
import { setupPath } from "@/lib/account"
import { fetchAccount } from "@/lib/server-account"
import { PageFallback } from "../page-fallback"
import { SignUpForm } from "./sign-up-form"

export default function SignUpPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <SignUpContent />
    </Suspense>
  )
}

async function SignUpContent() {
  const account = await fetchAccount()
  if (account) {
    redirect(setupPath(account) ?? "/")
  }

  return (
    <AuthShell
      title="Create an account"
      description="Email and password are enough to get started."
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-foreground underline">
            Sign in
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthShell>
  )
}
