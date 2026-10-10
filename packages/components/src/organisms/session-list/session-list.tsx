"use client"

import { Button } from "@repo/components/atoms/button"

export type SessionItem = {
  id: string
  userAgent: string | null
  createdAt: string
  current: boolean
}

function SessionList({
  sessions = [],
  pendingId = null,
  onRevoke = () => {},
  onRevokeAll = () => {},
}: {
  sessions?: SessionItem[]
  pendingId?: string | null
  onRevoke?: (id: string) => void
  onRevokeAll?: () => void
}) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Sessions</h1>
        <Button
          type="button"
          variant="outline"
          onClick={onRevokeAll}
          disabled={sessions.length === 0 || pendingId !== null}
        >
          Sign out everywhere
        </Button>
      </div>
      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active sessions.</p>
      ) : (
        <ul className="grid gap-2">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between gap-3 rounded-lg border px-3 py-3"
            >
              <div className="grid min-w-0 gap-1">
                <p className="truncate text-sm font-medium" title={session.userAgent ?? undefined}>
                  {session.userAgent || "Unknown device"}
                  {session.current ? " · This device" : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  Started {new Date(session.createdAt).toLocaleString()}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                disabled={pendingId !== null}
                onClick={() => onRevoke(session.id)}
              >
                {session.current ? "Sign out" : "Revoke"}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { SessionList }
