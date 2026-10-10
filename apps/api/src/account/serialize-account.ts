import type {
  BudgetMethod,
  Goal,
  OnboardingStatus,
  PayCycle,
  Profile,
  User,
} from '@prisma/client';

export type AccountUser = User & {
  profile: Profile | null;
  goals: Goal[];
};

export type AccountBody = {
  user: { id: string; email: string };
  profile: {
    locale: string | null;
    baseCurrency: string | null;
    budgetMethod: BudgetMethod | null;
    payCycle: PayCycle | null;
    nextPayDate: string | null;
    onboardingStatus: OnboardingStatus;
  };
  goal: {
    id: string;
    name: string;
    targetAmount: number;
    targetDate: string;
  } | null;
};

export function formatDateOnly(value: Date | null) {
  if (!value) {
    return null;
  }
  return value.toISOString().slice(0, 10);
}

export function parseDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return null;
  }
  return date;
}

export function serializeAccount(user: AccountUser): AccountBody {
  const profile = user.profile;
  const goal = user.goals[0] ?? null;
  return {
    user: { id: user.id, email: user.email },
    profile: {
      locale: profile?.locale ?? null,
      baseCurrency: profile?.baseCurrency ?? null,
      budgetMethod: profile?.budgetMethod ?? null,
      payCycle: profile?.payCycle ?? null,
      nextPayDate: formatDateOnly(profile?.nextPayDate ?? null),
      onboardingStatus: profile?.onboardingStatus ?? 'pending',
    },
    goal: goal
      ? {
          id: goal.id,
          name: goal.name,
          targetAmount: goal.targetAmount,
          targetDate: formatDateOnly(goal.targetDate) ?? '',
        }
      : null,
  };
}

export const accountInclude = {
  profile: true,
  goals: { orderBy: { createdAt: 'asc' as const }, take: 1 },
};
