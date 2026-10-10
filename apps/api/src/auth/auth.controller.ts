import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { CredentialsDto } from './dto/credentials.dto.js';
import type { AuthenticatedRequest } from './session.guard.js';
import { SessionGuard } from './session.guard.js';
import {
  clearedSessionCookieOptions,
  SESSION_COOKIE,
  sessionCookieOptions,
} from './session-cookie.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: CredentialsDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.authService.register(
      dto,
      request.header('user-agent'),
    );
    response.cookie(
      SESSION_COOKIE,
      session.token,
      sessionCookieOptions(session.expiresAt),
    );
    return session.body;
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: CredentialsDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.authService.login(
      dto,
      request.header('user-agent'),
    );
    response.cookie(
      SESSION_COOKIE,
      session.token,
      sessionCookieOptions(session.expiresAt),
    );
    return session.body;
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  async logout(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(request.sessionId);
    response.clearCookie(SESSION_COOKIE, clearedSessionCookieOptions());
    return { ok: true };
  }

  @Get('sessions')
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  listSessions(@Req() request: AuthenticatedRequest) {
    return this.authService.listSessions(request.user.id, request.sessionId);
  }

  @Delete('sessions/:id')
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  async revokeSession(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.revokeSession(
      request.user.id,
      id,
      request.sessionId,
    );
    if (result.revokedCurrent) {
      response.clearCookie(SESSION_COOKIE, clearedSessionCookieOptions());
    }
    return result;
  }

  @Post('logout-all')
  @HttpCode(200)
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  async logoutAll(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.revokeAllSessions(request.user.id);
    response.clearCookie(SESSION_COOKIE, clearedSessionCookieOptions());
    return { ok: true };
  }
}
