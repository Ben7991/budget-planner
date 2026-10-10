"use client"

import { useState } from "react"
import { GoalForm } from "@repo/components/organisms/goal-form"
import {
  MethodPicker,
  type BudgetMethodId,
} from "@repo/components/organisms/method-picker"
import {
  PayCycleForm,
  type PayCycleId,
} from "@repo/components/organisms/pay-cycle-form"
import { WizardShell } from "@repo/components/templates/wizard-shell"
import { readError, toMinorUnits } from "@/lib/account"

const STEPS = [
  { step: "Step 1 of 3", title: "How do you want to budget?" },
  { step: "Step 2 of 3", title: "When do you get paid?" },
  { step: "Step 3 of 3", title: "Add a first goal" },
] as const

export function SetupWizard({ currency }: { currency: string }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [method, setMethod] = useState<BudgetMethodId | null>(null)
  const [payCycle, setPayCycle] = useState<PayCycleId | null>(null)
  const [nextPayDate, setNextPayDate] = useState("")
  const [goalName, setGoalName] = useState("")
  const [goalAmount, setGoalAmount] = useState("")
  const [goalDate, setGoalDate] = useState("")
  const [methodError, setMethodError] = useState<string>()
  const [dateError, setDateError] = useState<string>()
  const [goalErrors, setGoalErrors] = useState<{
    name?: string
    amount?: string
    date?: string
  }>({})
  const [formError, setFormError] = useState<string>()
  const [pending, setPending] = useState(false)

  const step = STEPS[stepIndex] ?? STEPS[0]

  async function skip() {
    setPending(true)
    setFormError(undefined)
    const response = await fetch("/api/me/onboarding", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "skipped" }),
    })
    if (!response.ok) {
      setFormError(await readError(response))
      setPending(false)
      return
    }
    window.location.assign("/")
  }

  async function finish() {
    const started = Boolean(goalName.trim() || goalAmount.trim() || goalDate)
    const amount = toMinorUnits(goalAmount, currency)
    if (started && (!goalName.trim() || amount === null || !goalDate)) {
      setGoalErrors({
        name: goalName.trim() ? undefined : "Enter a goal name.",
        amount: amount === null ? "Enter an amount greater than zero." : undefined,
        date: goalDate ? undefined : "Enter a target date.",
      })
      return
    }

    setPending(true)
    setFormError(undefined)
    const response = await fetch("/api/me/onboarding", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        status: "complete",
        budgetMethod: method,
        payCycle,
        nextPayDate,
        ...(started && amount !== null
          ? {
              goal: {
                name: goalName.trim(),
                targetAmount: amount,
                targetDate: goalDate,
              },
            }
          : {}),
      }),
    })
    if (!response.ok) {
      setFormError(await readError(response))
      setPending(false)
      return
    }
    window.location.assign("/")
  }

  function onContinue() {
    setFormError(undefined)
    if (stepIndex === 0) {
      if (!method) {
        setMethodError("Choose a budget method.")
        return
      }
      setMethodError(undefined)
      setStepIndex(1)
      return
    }
    if (stepIndex === 1) {
      if (!payCycle || !nextPayDate) {
        setDateError(
          payCycle ? "Enter your next pay date." : "Choose a pay cycle.",
        )
        return
      }
      setDateError(undefined)
      setStepIndex(2)
      return
    }
    void finish()
  }

  return (
    <WizardShell
      step={step.step}
      title={step.title}
      onBack={stepIndex === 0 ? undefined : () => setStepIndex((current) => (current - 1) as 0 | 1 | 2)}
      onSkip={() => {
        void skip()
      }}
      onContinue={onContinue}
      continueLabel={stepIndex === 2 ? "Finish" : "Continue"}
      continueDisabled={pending}
    >
      {stepIndex === 0 ? <MethodPicker value={method} onChange={setMethod} /> : null}
      {stepIndex === 1 ? (
        <PayCycleForm
          payCycle={payCycle}
          nextPayDate={nextPayDate}
          dateError={dateError}
          onPayCycleChange={setPayCycle}
          onNextPayDateChange={setNextPayDate}
        />
      ) : null}
      {stepIndex === 2 ? (
        <GoalForm
          name={goalName}
          amount={goalAmount}
          targetDate={goalDate}
          nameError={goalErrors.name}
          amountError={goalErrors.amount}
          dateError={goalErrors.date}
          onNameChange={setGoalName}
          onAmountChange={setGoalAmount}
          onTargetDateChange={setGoalDate}
        />
      ) : null}
      {methodError && stepIndex === 0 ? (
        <p className="mt-3 text-sm text-destructive">{methodError}</p>
      ) : null}
      {formError ? <p className="mt-3 text-sm text-destructive">{formError}</p> : null}
    </WizardShell>
  )
}
