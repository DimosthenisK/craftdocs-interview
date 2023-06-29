import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { PrismaService } from './prisma/prisma.service';
import { appValidationPipe } from './app/pipes';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const prismaService = app.get<PrismaService>(PrismaService);
  const configService: ConfigService = app.get(ConfigService);
  prismaService.enableShutdownHooks(app);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Craft Docs')
    .setDescription('Craftdocs')
    .setVersion('1.0')
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
