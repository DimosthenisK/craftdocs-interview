import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { GenericContainer, PostgreSqlContainer } from 'testcontainers';

import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { RedisIoAdapter } from '../../../src/app/lib';
import { appValidationPipe } from '../../../src/app/pipes';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { AuthenticationService } from '../../../src/user/authentication/authentication.service';
import { getRandomFreePort } from './get-random-free-port';
import { prismaReset } from './prisma-reset';

export const buildTest = async (
  testID: string,
  testModuleFixture: TestingModuleBuilder,
) => {
  const pgPort = await getRandomFreePort();
  const dbUrl = `postgresql://${testID}:${testID}@localhost:${pgPort}/${testID}?schema=public`;
  const dbContainer = await new PostgreSqlContainer()
    .withExposedPorts({ container: 5432, host: pgPort })
    .withName(`${testID}-${pgPort}`)
    .withDatabase(testID)
    .withUsername(testID)
    .withPassword(testID)
    .start();

  const redisPort = await getRandomFreePort();
  const redisContainer = await new GenericContainer('redis')
    .withExposedPorts({ container: 6379, host: redisPort })
    .withName(`${testID}-${redisPort}`)
    .start();

  await prismaReset(dbUrl);

  let prismaService = new PrismaService({
    datasources: { db: { url: dbUrl } },
  });
  await prismaService.$connect();

  const prismaTestingHelper = new PrismaTestingHelper(prismaService);
  prismaService = prismaTestingHelper.getProxyClient();

  const moduleFixture: TestingModule = await testModuleFixture
    .overrideProvider(ConfigService)
    .useValue({
      get: (value: string) => {
        switch (value) {
          case 'DATABASE_URL':
            return dbUrl;
          case 'REDIS_HOST':
            return redisContainer.getHost();
          case 'REDIS_PORT':
            return redisContainer.getMappedPort(6379);
          default:
            return process.env[value];
        }
      },
    })
    .overrideProvider(PrismaService)
    .useValue(prismaService)
    .compile();

  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(appValidationPipe);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(
    `redis://${app.get(ConfigService).get('REDIS_URL')}:${app
      .get(ConfigService)
      .get('REDIS_PORT')}`,
  );

  app.useWebSocketAdapter(redisIoAdapter);

  prismaService = app.get(PrismaService);
  const authService = app.get(AuthenticationService);

  const cacheManager = app.get(CACHE_MANAGER);

  await Promise.all([app.init()]);

  return {
    app,
    prismaService,
    authService,
    beforeAll: async () => {
      await app.listen(await getRandomFreePort());
    },
    beforeEach: async () => {
      await prismaTestingHelper.startNewTransaction();
    },
    afterEach: async () => {
      prismaTestingHelper.rollbackCurrentTransaction();
      await cacheManager.set('socket-to-user-map', {}, 0);
    },
    afterAll: async () => {
      await prismaService.$disconnect();
      await app.close();
      await dbContainer.stop();
      await redisContainer.stop();
    },
  };
};
