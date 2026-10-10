"use client"

import { TextField } from "@repo/components/molecules/text-field"

function GoalForm({
  name = "",
  amount = "",
  targetDate = "",
  nameError,
  amountError,
  dateError,
  onNameChange = () => {},
  onAmountChange = () => {},
  onTargetDateChange = () => {},
}: {
  name?: string
  amount?: string
  targetDate?: string
  nameError?: string
  amountError?: string
  dateError?: string
  onNameChange?: (value: string) => void
  onAmountChange?: (value: string) => void
  onTargetDateChange?: (value: string) => void
}) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        Optional. You can add a goal later.
      </p>
      <TextField
        label="Goal name"
        value={name}
        error={nameError}
        onChange={(event) => onNameChange(event.target.value)}
      />
      <TextField
        label="Target amount"
        inputMode="decimal"
        value={amount}
        error={amountError}
        onChange={(event) => onAmountChange(event.target.value)}
      />
      <TextField
        label="Target date"
        type="date"
        value={targetDate}
        error={dateError}
        onChange={(event) => onTargetDateChange(event.target.value)}
      />
    </div>
  )
}

export { GoalForm }
