import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';
import { SESSION_COOKIE } from './auth/session-cookie.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Budget Planner API')
    .setDescription('HTTP API for the budget planner')
    .setVersion('0.0.1')
    .addCookieAuth(SESSION_COOKIE)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
