import { IsString, Matches } from 'class-validator';

export class RegionDto {
  @IsString()
  @Matches(/^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8}){0,3}$/)
  locale: string;

  @IsString()
  @Matches(/^[A-Za-z]{3}$/)
  baseCurrency: string;
}
