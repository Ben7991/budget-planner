import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { SessionGuard } from '../auth/session.guard.js';
import type { AuthenticatedRequest } from '../auth/session.guard.js';
import { OnboardingDto } from './dto/onboarding.dto.js';
import { RegionDto } from './dto/region.dto.js';
import { ProfileService } from './profile.service.js';

@ApiTags('me')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('me')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getMe(@Req() request: AuthenticatedRequest) {
    return this.profileService.getAccount(request.user.id);
  }

  @Get('suggestion')
  suggestion(@Headers('accept-language') acceptLanguage?: string) {
    return this.profileService.suggest(acceptLanguage);
  }

  @Patch('region')
  updateRegion(
    @Req() request: AuthenticatedRequest,
    @Body() dto: RegionDto,
  ) {
    return this.profileService.updateRegion(request.user.id, dto);
  }

  @Patch('onboarding')
  updateOnboarding(
    @Req() request: AuthenticatedRequest,
    @Body() dto: OnboardingDto,
  ) {
    return this.profileService.updateOnboarding(request.user.id, dto);
  }
}
