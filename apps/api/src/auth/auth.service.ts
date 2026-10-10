import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import argon2, { argon2id, type HashOptions } from 'argon2';
import {
  accountInclude,
  serializeAccount,
} from '../account/serialize-account.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CredentialsDto } from './dto/credentials.dto.js';
import { createSessionToken, SESSION_TTL_MS } from './session-cookie.js';

const ARGON_OPTIONS: HashOptions = {
  type: argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: CredentialsDto, userAgent: string | undefined) {
    const passwordHash = await argon2.hash(dto.password, ARGON_OPTIONS);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          profile: { create: {} },
        },
      });
      return this.openSession(user.id, userAgent);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'An account with that email already exists.',
        );
      }
      throw error;
    }
  }

  async login(dto: CredentialsDto, userAgent: string | undefined) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    const passwordHash = user?.passwordHash ?? (await this.dummyHash());
    const matches = await argon2.verify(passwordHash, dto.password);
    if (!user || !matches) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    return this.openSession(user.id, userAgent);
  }

  async logout(sessionId: string) {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  async listSessions(userId: string, currentSessionId: string) {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    return {
      sessions: sessions.map((session) => ({
        id: session.id,
        userAgent: session.userAgent,
        createdAt: session.createdAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
        current: session.id === currentSessionId,
      })),
    };
  }

  async revokeSession(userId: string, sessionId: string, currentSessionId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId, revokedAt: null },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    await this.prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });
    return { revokedCurrent: session.id === currentSessionId };
  }

  async revokeAllSessions(userId: string) {
    await this.prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async openSession(userId: string, userAgent: string | undefined) {
    const { token, tokenHash } = createSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await this.prisma.session.create({
      data: {
        userId,
        tokenHash,
        userAgent: userAgent?.slice(0, 512),
        expiresAt,
      },
    });
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: accountInclude,
    });
    return { token, expiresAt, body: serializeAccount(user) };
  }

  private dummyHash() {
    return argon2.hash('invalid-password', ARGON_OPTIONS);
  }
}
