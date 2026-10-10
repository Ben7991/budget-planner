import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';
import { hashSessionToken, SESSION_COOKIE } from './session-cookie.js';

export type AuthenticatedRequest = Request & {
  sessionId: string;
  user: { id: string; email: string };
};

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<Request & { cookies?: Record<string, string> }>();
    const token = request.cookies?.[SESSION_COOKIE];
    if (!token) {
      throw new UnauthorizedException('Sign in required');
    }

    const session = await this.prisma.session.findUnique({
      where: { tokenHash: hashSessionToken(token) },
      include: { user: true },
    });
    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      throw new UnauthorizedException('Sign in required');
    }

    const authenticated = request as AuthenticatedRequest;
    authenticated.sessionId = session.id;
    authenticated.user = { id: session.user.id, email: session.user.email };
    return true;
  }
}
