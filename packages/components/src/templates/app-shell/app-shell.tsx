import type { ReactNode } from "react"

function AppShell({
  header,
  children,
}: {
  header?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 border-b px-6 py-4">
        {header}
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">{children}</main>
    </div>
  )
}

export { AppShell }
