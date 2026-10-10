export type Account = {
  user: { id: string; email: string }
  profile: {
    locale: string | null
    baseCurrency: string | null
    budgetMethod:
      | "fifty_thirty_twenty"
      | "zero_based"
      | "envelopes"
      | "custom"
      | null
    payCycle: "weekly" | "biweekly" | "semimonthly" | "monthly" | null
    nextPayDate: string | null
    onboardingStatus: "pending" | "skipped" | "complete"
  }
  goal: {
    id: string
    name: string
    targetAmount: number
    targetDate: string
  } | null
}

const ZERO_DECIMAL = new Set(["JPY", "KRW"])

const METHOD_LABELS: Record<NonNullable<Account["profile"]["budgetMethod"]>, string> = {
  fifty_thirty_twenty: "50/30/20",
  zero_based: "Zero-based",
  envelopes: "Envelopes",
  custom: "Custom",
}

export function setupPath(account: Account) {
  if (!account.profile.locale || !account.profile.baseCurrency) {
    return "/setup/region"
  }
  if (account.profile.onboardingStatus === "pending") {
    return "/setup"
  }
  return null
}

export function methodLabel(method: NonNullable<Account["profile"]["budgetMethod"]>) {
  return METHOD_LABELS[method]
}

export function minorUnitExponent(currency: string) {
  return ZERO_DECIMAL.has(currency) ? 0 : 2
}

export function toMinorUnits(input: string, currency: string) {
  const trimmed = input.trim()
  const exponent = minorUnitExponent(currency)
  const pattern = exponent === 0 ? /^\d+$/ : /^\d+(\.\d{1,2})?$/
  if (!pattern.test(trimmed)) {
    return null
  }
  const [whole, fraction = ""] = trimmed.split(".")
  const minor =
    Number(whole) * 10 ** exponent + Number(fraction.padEnd(exponent, "0") || 0)
  if (!Number.isSafeInteger(minor) || minor < 1) {
    return null
  }
  return minor
}

export function formatMinor(amount: number, currency: string, locale: string) {
  const exponent = minorUnitExponent(currency)
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount / 10 ** exponent)
}

export async function readError(response: Response) {
  const body = (await response.json().catch(() => null)) as {
    message?: string | string[]
  } | null
  if (Array.isArray(body?.message)) {
    return body.message.join(" ")
  }
  if (typeof body?.message === "string") {
    return body.message
  }
  return "Something went wrong. Try again."
}
