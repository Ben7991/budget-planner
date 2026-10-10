"use client"

import { useState } from "react"
import { SessionList, type SessionItem } from "@repo/components/organisms/session-list"

export function SessionsManager({ sessions }: { sessions: SessionItem[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null)

  return (
    <SessionList
      sessions={sessions}
      pendingId={pendingId}
      onRevoke={(id) => {
        setPendingId(id)
        void fetch(`/api/auth/sessions/${id}`, { method: "DELETE" })
          .then(async (response) => {
            const body = (await response.json().catch(() => null)) as {
              revokedCurrent?: boolean
            } | null
            if (!response.ok || body?.revokedCurrent) {
              window.location.assign("/sign-in")
              return
            }
            window.location.reload()
          })
          .catch(() => {
            window.location.reload()
          })
      }}
      onRevokeAll={() => {
        setPendingId("all")
        void fetch("/api/auth/logout-all", { method: "POST" }).finally(() => {
          window.location.assign("/sign-in")
        })
      }}
    />
  )
}
