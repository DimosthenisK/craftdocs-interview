import * as request from 'supertest';

import { AuthenticationService } from '../../../src/user/authentication/authentication.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { PrismaModule } from '../../../src/prisma/prisma.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { UserModule } from '../../../src/user/user.module';
import { UserService } from '../../../src/user/user.service';
import { buildTest } from '../helpers';

describe('UserController (e2e)', () => {
  jest.setTimeout(600000);
  const testID = `user-container-test`;

  let app: INestApplication;
  let prismaService: PrismaService;
  let authService: AuthenticationService;
  let userService: UserService;

  let afterAllFn: () => Promise<void>;
  let beforeEachFn: () => Promise<void>;
  let afterEachFn: () => Promise<void>;

  beforeAll(async () => {
    const moduleFixture = Test.createTestingModule({
      imports: [
        PrismaModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        CacheModule.register({ isGlobal: true }),
        UserModule,
      ],
    });

    const test = await buildTest(testID, moduleFixture);

    app = test.app;
    prismaService = test.prismaService;
    authService = test.authService;
    userService = app.get(UserService);

    afterAllFn = test.afterAll;
    beforeEachFn = test.beforeEach;
    afterEachFn = test.afterEach;
  });

  afterAll(async () => {
    await afterAllFn();
  });

  beforeEach(async () => {
    await beforeEachFn();
  });

  afterEach(async () => {
    await afterEachFn();
  });

  describe('GET /user', () => {
    it('should return the currently logged in user', async () => {
      const mockUser = await userService.create({ name: 'Mock User' });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const response = await request(app.getHttpServer())
        .get(`/user`)
        .set('Authorization', `Bearer ${mockUserToken}`)
        .expect(200);

      expect(response.body.id).toMatch(mockUser.id);
      expect(response.body.name).toMatch(mockUser.name);
    });
  });

  describe('PATCH /user', () => {
    it('should update the currently logged in user', async () => {
      const mockUser = await userService.create({ name: 'Mock User' });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const response = await request(app.getHttpServer())
        .patch(`/user`)
        .set('Authorization', `Bearer ${mockUserToken}`)
        .send({ name: 'New Name' })
        .expect(200);

      expect(response.body.id).toMatch(mockUser.id);
      expect(response.body.name).toMatch('New Name');
    });

    it('should not update the currently logged in user if the name is too long', async () => {
      const mockUser = await userService.create({ name: 'Mock User' });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const response = await request(app.getHttpServer())
        .patch(`/user`)
        .set('Authorization', `Bearer ${mockUserToken}`)
        .send({ name: 'New Name'.repeat(100) })
        .expect(400);

      expect(response.body.errorCode).toMatchSnapshot();
    });

    it('should not work if the user isnt logged in', async () => {
      const mockUser = await userService.create({ name: 'Mock User' });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const response = await request(app.getHttpServer())
        .patch(`/user`)
        //.set('Authorization', `Bearer ${mockUserToken}`)
        .send({ name: 'New Name'.repeat(100) })
        .expect(401);

      expect(response.body.errorCode).toMatchSnapshot();
    });
  });
});
