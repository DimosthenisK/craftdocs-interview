import * as request from 'supertest';

import { AuthenticationService } from '../../../src/user/authentication/authentication.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { DocumentModule } from '../../../src/document/document.module';
import { DocumentService } from '../../../src/document/document.service';
import { INestApplication } from '@nestjs/common';
import { PrismaModule } from '../../../src/prisma/prisma.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { UserModule } from '../../../src/user/user.module';
import { UserService } from '../../../src/user/user.service';
import { buildTest } from '../helpers';

describe('DocumentController (e2e)', () => {
  jest.setTimeout(600000);
  const testID = `document-container-test`;

  let app: INestApplication;
  let prismaService: PrismaService;
  let authService: AuthenticationService;
  let userService: UserService;
  let documentService: DocumentService;

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
        DocumentModule,
        UserModule,
      ],
    });

    const test = await buildTest(testID, moduleFixture);

    app = test.app;
    prismaService = test.prismaService;
    authService = test.authService;
    documentService = app.get(DocumentService);
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

  describe('POST /document', () => {
    it('should create a document', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const response = await request(app.getHttpServer())
        .post('/document')
        .set('Authorization', `Bearer ${mockUserToken}`)
        .send({ content: 'Test content' })
        .expect(201);

      expect(response.body.content).toMatch('Test content');
    });

    it('should not work with empty content', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const response = await request(app.getHttpServer())
        .post('/document')
        .set('Authorization', `Bearer ${mockUserToken}`)
        .send({ content: '' })
        .expect(400);
    });

    it('should not work if a user isnt logged in', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const response = await request(app.getHttpServer())
        .post('/document')
        //.set('Authorization', `Bearer ${mockUserToken}`)
        .send({ content: 'Test content' })
        .expect(401);
    });
  });

  describe('PATCH /document/:id', () => {
    it('should create a document', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const mockDocument = await documentService.create(mockUser.id, {
        content: 'Test content',
      });

      const response = await request(app.getHttpServer())
        .patch(`/document/${mockDocument.id}`)
        .set('Authorization', `Bearer ${mockUserToken}`)
        .send({ content: 'New test content' })
        .expect(200);

      expect(response.body.content).toMatch('New test content');
    });

    it('should not work with empty content', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const mockDocument = await documentService.create(mockUser.id, {
        content: 'Test content',
      });

      const response = await request(app.getHttpServer())
        .patch(`/document/${mockDocument.id}`)
        .set('Authorization', `Bearer ${mockUserToken}`)
        .send({ content: '' })
        .expect(400);
    });

    it('should not work if a user isnt logged in', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const mockDocument = await documentService.create(mockUser.id, {
        content: 'Test content',
      });

      const response = await request(app.getHttpServer())
        .patch(`/document/${mockDocument.id}`)
        //.set('Authorization', `Bearer ${mockUserToken}`)
        .send({ content: 'New test content' })
        .expect(401);
    });
  });
});
