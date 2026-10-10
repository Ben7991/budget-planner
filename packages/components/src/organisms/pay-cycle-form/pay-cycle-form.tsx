"use client"

import { Button } from "@repo/components/atoms/button"
import { Label } from "@repo/components/atoms/label"
import { Input } from "@repo/components/atoms/input"

const PAY_CYCLES = [
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Bi-weekly" },
  { id: "semimonthly", label: "Semi-monthly" },
  { id: "monthly", label: "Monthly" },
] as const

export type PayCycleId = (typeof PAY_CYCLES)[number]["id"]

function PayCycleForm({
  payCycle = null,
  nextPayDate = "",
  dateError,
  onPayCycleChange = () => {},
  onNextPayDateChange = () => {},
}: {
  payCycle?: PayCycleId | null
  nextPayDate?: string
  dateError?: string
  onPayCycleChange?: (value: PayCycleId) => void
  onNextPayDateChange?: (value: string) => void
}) {
  const dateId = "next-pay-date"

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2" role="listbox" aria-label="Pay cycle">
        {PAY_CYCLES.map((cycle) => {
          const selected = payCycle === cycle.id
          return (
            <Button
              key={cycle.id}
              type="button"
              variant={selected ? "default" : "outline"}
              aria-pressed={selected}
              onClick={() => onPayCycleChange(cycle.id)}
            >
              {cycle.label}
            </Button>
          )
        })}
      </div>
      <div className="grid gap-2">
        <Label htmlFor={dateId}>Next pay date</Label>
        <Input
          id={dateId}
          type="date"
          value={nextPayDate}
          aria-invalid={dateError ? true : undefined}
          onChange={(event) => onNextPayDateChange(event.target.value)}
        />
        {dateError ? <p className="text-sm text-destructive">{dateError}</p> : null}
      </div>
    </div>
  )
}

export { PayCycleForm, PAY_CYCLES }
