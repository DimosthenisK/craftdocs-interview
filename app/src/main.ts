import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './app/lib';
import { appValidationPipe } from './app/pipes';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const prismaService = app.get<PrismaService>(PrismaService);
  const configService: ConfigService = app.get(ConfigService);
  prismaService.enableShutdownHooks(app);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(
    `redis://${configService.get('REDIS_URL')}:${configService.get(
      'REDIS_PORT',
    )}`,
  );

  app.useWebSocketAdapter(redisIoAdapter);

  const config = new DocumentBuilder()
    .setTitle('Craft Docs')
    .setDescription('Craftdocs')
    .setVersion('1.0')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.useGlobalPipes(appValidationPipe);

  await app.listen(
    configService.get('PORT') || 3000,
    configService.get<string | undefined>('HOST') || '0.0.0.0',
  );
}
bootstrap();
