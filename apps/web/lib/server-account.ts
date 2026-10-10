import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import type { Account } from "./account"

const API_URL = process.env.API_URL ?? "http://localhost:3001"
const SESSION_COOKIE = "bp_session"

async function sessionCookie() {
  const jar = await cookies()
  return jar.get(SESSION_COOKIE)?.value
}

async function api(path: string, headerList?: Headers) {
  const token = await sessionCookie()
  const requestHeaders = new Headers()
  if (token) {
    requestHeaders.set("cookie", `${SESSION_COOKIE}=${token}`)
  }
  const acceptLanguage = headerList?.get("accept-language")
  if (acceptLanguage) {
    requestHeaders.set("accept-language", acceptLanguage)
  }
  return fetch(`${API_URL}${path}`, {
    headers: requestHeaders,
    cache: "no-store",
  })
}

export async function fetchAccount(): Promise<Account | null> {
  const token = await sessionCookie()
  if (!token) {
    return null
  }
  const response = await api("/me")
  if (response.status === 401) {
    return null
  }
  if (!response.ok) {
    throw new Error("Could not load the account")
  }
  return response.json() as Promise<Account>
}

export async function requireAccount() {
  const account = await fetchAccount()
  if (!account) {
    redirect("/sign-in")
  }
  return account
}

export async function fetchSuggestion() {
  const headerList = await headers()
  const response = await api("/me/suggestion", headerList)
  if (!response.ok) {
    return { locale: "en-US", currency: "USD" }
  }
  return response.json() as Promise<{ locale: string; currency: string }>
}

export type SessionRecord = {
  id: string
  userAgent: string | null
  createdAt: string
  expiresAt: string
  current: boolean
}

export async function fetchSessions() {
  const response = await api("/auth/sessions")
  if (response.status === 401) {
    redirect("/sign-in")
  }
  if (!response.ok) {
    throw new Error("Could not load sessions")
  }
  return response.json() as Promise<{ sessions: SessionRecord[] }>
}
