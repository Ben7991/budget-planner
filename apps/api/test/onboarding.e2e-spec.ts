import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/configure-app.js';

const email = 'ada@example.com';
const password = 'correct-horse';

describe('Onboarding (e2e)', () => {
  let app: INestApplication<App>;
  const prisma = new PrismaClient();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('registers, rejects a wrong password, and revokes one session then all', async () => {
    const first = request.agent(app.getHttpServer());
    const registered = await first
      .post('/auth/register')
      .send({ email, password })
      .expect(201);
    expect(registered.body.user.email).toBe(email);
    expect(registered.body.profile.onboardingStatus).toBe('pending');

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'not-the-password' })
      .expect(401);

    const second = request.agent(app.getHttpServer());
    await second.post('/auth/login').send({ email, password }).expect(200);

    const listed = await second.get('/auth/sessions').expect(200);
    expect(listed.body.sessions).toHaveLength(2);
    const other = listed.body.sessions.find(
      (session: { current: boolean }) => !session.current,
    );
    expect(other).toBeTruthy();

    await second.delete(`/auth/sessions/${other.id}`).expect(200);
    await first.get('/me').expect(401);
    await second.get('/me').expect(200);

    await second.post('/auth/logout-all').expect(200);
    await second.get('/me').expect(401);
  });

  it('stores a confirmed region, a goal, and 50/30/20 groups', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent.post('/auth/register').send({ email, password }).expect(201);

    const suggestion = await agent
      .get('/me/suggestion')
      .set('Accept-Language', 'en-GB')
      .expect(200);
    expect(suggestion.body).toEqual({ locale: 'en-GB', currency: 'GBP' });

    await agent
      .patch('/me/region')
      .send({ locale: 'en-GB', baseCurrency: 'GBP' })
      .expect(200);

    const completed = await agent
      .patch('/me/onboarding')
      .send({
        status: 'complete',
        budgetMethod: 'fifty_thirty_twenty',
        payCycle: 'biweekly',
        nextPayDate: '2026-10-16',
        goal: {
          name: 'Emergency fund',
          targetAmount: 150000,
          targetDate: '2027-01-01',
        },
      })
      .expect(200);

    expect(completed.body.profile).toMatchObject({
      locale: 'en-GB',
      baseCurrency: 'GBP',
      budgetMethod: 'fifty_thirty_twenty',
      payCycle: 'biweekly',
      nextPayDate: '2026-10-16',
      onboardingStatus: 'complete',
    });
    expect(completed.body.goal).toMatchObject({
      name: 'Emergency fund',
      targetAmount: 150000,
      targetDate: '2027-01-01',
    });

    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
      include: { categoryGroups: { orderBy: { sortOrder: 'asc' } } },
    });
    expect(user.categoryGroups.map((group) => group.name)).toEqual([
      'Needs',
      'Wants',
      'Savings and debt',
    ]);
  });

  it('skips onboarding without creating category groups', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/auth/register')
      .send({ email: 'skip@example.com', password })
      .expect(201);
    await agent
      .patch('/me/region')
      .send({ locale: 'en-US', baseCurrency: 'USD' })
      .expect(200);
    const skipped = await agent
      .patch('/me/onboarding')
      .send({ status: 'skipped' })
      .expect(200);
    expect(skipped.body.profile.onboardingStatus).toBe('skipped');
    expect(
      await prisma.categoryGroup.count({
        where: { user: { email: 'skip@example.com' } },
      }),
    ).toBe(0);
  });
});
