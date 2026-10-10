import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class GoalDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name: string;

  @IsInt()
  @Min(1)
  @Max(1_000_000_000_000)
  targetAmount: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  targetDate: string;
}

export class OnboardingDto {
  @IsIn(['skipped', 'complete'])
  status: 'skipped' | 'complete';

  @ValidateIf((dto: OnboardingDto) => dto.status === 'complete')
  @IsIn(['fifty_thirty_twenty', 'zero_based', 'envelopes', 'custom'])
  budgetMethod?:
    | 'fifty_thirty_twenty'
    | 'zero_based'
    | 'envelopes'
    | 'custom';

  @ValidateIf((dto: OnboardingDto) => dto.status === 'complete')
  @IsIn(['weekly', 'biweekly', 'semimonthly', 'monthly'])
  payCycle?: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';

  @ValidateIf((dto: OnboardingDto) => dto.status === 'complete')
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  nextPayDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GoalDto)
  goal?: GoalDto;
}
