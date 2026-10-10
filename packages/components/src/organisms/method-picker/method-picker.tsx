"use client"

import { cn } from "cn"
import { Button } from "@repo/components/atoms/button"

const METHODS = [
  {
    id: "fifty_thirty_twenty",
    label: "50/30/20",
    description: "Start with Needs, Wants, and Savings and debt.",
  },
  {
    id: "zero_based",
    label: "Zero-based",
    description: "Give every dollar a job before the period starts.",
  },
  {
    id: "envelopes",
    label: "Envelopes",
    description: "Each category holds the money available to spend.",
  },
  {
    id: "custom",
    label: "Custom",
    description: "Build groups and caps without a template.",
  },
] as const

export type BudgetMethodId = (typeof METHODS)[number]["id"]

function MethodPicker({
  value = null,
  onChange = () => {},
}: {
  value?: BudgetMethodId | null
  onChange?: (value: BudgetMethodId) => void
}) {
  return (
    <div className="grid gap-2" role="listbox" aria-label="Budget method">
      {METHODS.map((method) => {
        const selected = value === method.id
        return (
          <Button
            key={method.id}
            type="button"
            variant={selected ? "default" : "outline"}
            className={cn("h-auto w-full justify-start px-3 py-3 text-left")}
            aria-pressed={selected}
            onClick={() => onChange(method.id)}
          >
            <span className="grid gap-0.5">
              <span>{method.label}</span>
              <span
                className={cn(
                  "text-xs font-normal",
                  selected ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {method.description}
              </span>
            </span>
          </Button>
        )
      })}
    </div>
  )
}

export { MethodPicker, METHODS }
