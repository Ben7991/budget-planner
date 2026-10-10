import { BadRequestException, Injectable } from '@nestjs/common';
import type { BudgetMethod, PayCycle } from '@prisma/client';
import {
  accountInclude,
  parseDateOnly,
  serializeAccount,
} from '../account/serialize-account.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { OnboardingDto } from './dto/onboarding.dto.js';
import type { RegionDto } from './dto/region.dto.js';
import { canonicalCurrency, canonicalLocale, suggestRegion } from './region.js';

const FIFTY_THIRTY_TWENTY_GROUPS = [
  { name: 'Needs', sortOrder: 0 },
  { name: 'Wants', sortOrder: 1 },
  { name: 'Savings and debt', sortOrder: 2 },
];

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  suggest(acceptLanguage: string | undefined) {
    return suggestRegion(acceptLanguage);
  }

  async getAccount(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: accountInclude,
    });
    return serializeAccount(user);
  }

  async updateRegion(userId: string, dto: RegionDto) {
    const locale = canonicalLocale(dto.locale);
    const baseCurrency = canonicalCurrency(dto.baseCurrency);
    if (!locale || !baseCurrency) {
      throw new BadRequestException('Enter a valid locale and currency.');
    }
    await this.prisma.profile.update({
      where: { userId },
      data: { locale, baseCurrency },
    });
    return this.getAccount(userId);
  }

  async updateOnboarding(userId: string, dto: OnboardingDto) {
    if (dto.status === 'skipped') {
      await this.prisma.profile.update({
        where: { userId },
        data: { onboardingStatus: 'skipped' },
      });
      return this.getAccount(userId);
    }

    const nextPayDate = parseDateOnly(dto.nextPayDate ?? '');
    const goalDate = dto.goal ? parseDateOnly(dto.goal.targetDate) : null;
    if (!nextPayDate || (dto.goal && !goalDate)) {
      throw new BadRequestException('Enter a valid date.');
    }

    const budgetMethod = dto.budgetMethod as BudgetMethod;
    const payCycle = dto.payCycle as PayCycle;

    await this.prisma.$transaction(async (tx) => {
      await tx.profile.update({
        where: { userId },
        data: {
          onboardingStatus: 'complete',
          budgetMethod,
          payCycle,
          nextPayDate,
        },
      });

      if (dto.goal && goalDate) {
        const existingGoals = await tx.goal.count({ where: { userId } });
        if (existingGoals === 0) {
          await tx.goal.create({
            data: {
              userId,
              name: dto.goal.name.trim(),
              targetAmount: dto.goal.targetAmount,
              targetDate: goalDate,
            },
          });
        }
      }

      if (budgetMethod === 'fifty_thirty_twenty') {
        const existingGroups = await tx.categoryGroup.count({
          where: { userId },
        });
        if (existingGroups === 0) {
          await tx.categoryGroup.createMany({
            data: FIFTY_THIRTY_TWENTY_GROUPS.map((group) => ({
              userId,
              name: group.name,
              sortOrder: group.sortOrder,
            })),
          });
        }
      }
    });

    return this.getAccount(userId);
  }
}
