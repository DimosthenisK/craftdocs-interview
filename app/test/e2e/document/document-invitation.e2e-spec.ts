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

describe('DocumentInvitationController (e2e)', () => {
  jest.setTimeout(600000);
  const testID = `document-invitation-container-test`;

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

  describe('POST /document/:id/invitation', () => {
    it('should create an invitation', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const mockUserToInvite1 = await userService.create({
        name: 'Invited Mock User 1',
      });
      const mockUserToInvite2 = await userService.create({
        name: 'Not Invited Mock User 2',
      });

      const mockDocument = await documentService.create(mockUser.id, {
        content: 'Test Content',
      });

      const response = await request(app.getHttpServer())
        .post(`/document/${mockDocument.id}/invitation`)
        .set('Authorization', `Bearer ${mockUserToken}`)
        .send({ userId: mockUserToInvite1.id })
        .expect(201);

      expect(response.body.accepted).toBe(false);
      expect(response.body.documentId).toMatch(mockDocument.id);
      expect(response.body.userId).toMatch(mockUserToInvite1.id);

      expect(await prismaService.documentInvitation.findMany()).toHaveLength(1);
    });

    it('should not work with invalid user', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const mockDocument = await documentService.create(mockUser.id, {
        content: 'Test Content',
      });

      const response = await request(app.getHttpServer())
        .post(`/document/${mockDocument.id}/invitation`)
        .set('Authorization', `Bearer ${mockUserToken}`)
        .send({ userId: 'NOT_A_USER_ID' })
        .expect(404);

      expect(response.body.errorCode).toBe('ENTITY_DOESNT_EXIST_EXCEPTION');
      expect(response.body.entity).toBe('User');

      expect(await prismaService.documentInvitation.findMany()).toHaveLength(0);
    });

    it('should not work if the user making the request isnt the owner', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const mockBadUser = await userService.create({
        name: 'Bad User 1',
      });
      const mockBadUserToken = await authService.generateTokenForUser(
        mockBadUser,
      );

      const mockDocument = await documentService.create(mockUser.id, {
        content: 'Test Content',
      });

      const response = await request(app.getHttpServer())
        .post(`/document/${mockDocument.id}/invitation`)
        .set('Authorization', `Bearer ${mockBadUserToken}`)
        .send({ userId: mockBadUser.id })
        .expect(403);

      expect(response.body.errorCode).toBe('FORBIDDEN_EXCEPTION');

      expect(await prismaService.documentInvitation.findMany()).toHaveLength(0);
    });

    it('should not work if a user isnt logged in', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const mockDocument = await documentService.create(mockUser.id, {
        content: 'Test Content',
      });

      const response = await request(app.getHttpServer())
        .post(`/document/${mockDocument.id}/invitation`)
        //.set('Authorization', `Bearer ${mockUserToken}`)
        .send({ userId: 'NOT_A_USER_ID' })
        .expect(401);
    });
  });

  describe('PATCH /document/:id/invitation/accept', () => {
    it('should accept an invitation', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const mockUserToInvite1 = await userService.create({
        name: 'Invited Mock User 1',
      });
      const mockUserToInvite1Token = await authService.generateTokenForUser(
        mockUserToInvite1,
      );

      const mockUserToInvite2 = await userService.create({
        name: 'Not Invited Mock User 2',
      });

      const mockDocument = await documentService.create(mockUser.id, {
        content: 'Test Content',
      });

      const mockInvitation = await prismaService.documentInvitation.create({
        data: {
          documentId: mockDocument.id,
          userId: mockUserToInvite1.id,
        },
      });

      const response = await request(app.getHttpServer())
        .patch(
          `/document/${mockDocument.id}/invitation/${mockInvitation.id}/accept`,
        )
        .set('Authorization', `Bearer ${mockUserToInvite1Token}`)
        .expect(200);

      expect(response.body.accepted).toBe(true);
      expect(response.body.documentId).toMatch(mockDocument.id);
      expect(response.body.userId).toMatch(mockUserToInvite1.id);

      expect(await prismaService.documentInvitation.findMany()).toHaveLength(1);
      expect(await prismaService.documentSubscription.findMany()).toHaveLength(
        2,
      );
    });

    it('should not work with invalid invitation ID', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const mockUserToInvite1 = await userService.create({
        name: 'Invited Mock User 1',
      });
      const mockUserToInvite1Token = await authService.generateTokenForUser(
        mockUserToInvite1,
      );

      const mockDocument = await documentService.create(mockUser.id, {
        content: 'Test Content',
      });

      const mockInvitation = await prismaService.documentInvitation.create({
        data: {
          documentId: mockDocument.id,
          userId: mockUserToInvite1.id,
        },
      });

      const response = await request(app.getHttpServer())
        .patch(
          `/document/${mockDocument.id}/invitation/NOT_AN_INVITATION_ID/accept`,
        )
        .set('Authorization', `Bearer ${mockUserToInvite1Token}`)
        .expect(404);

      expect(await prismaService.documentInvitation.findMany()).toHaveLength(1);
    });

    it('should not work if the user accepting the invitation isnt the one invited', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const mockUserToInvite1 = await userService.create({
        name: 'Invited Mock User 1',
      });

      const mockUserToInvite2 = await userService.create({
        name: 'Not Invited Mock User 2',
      });
      const mockUserToInvite2Token = await authService.generateTokenForUser(
        mockUserToInvite2,
      );

      const mockDocument = await documentService.create(mockUser.id, {
        content: 'Test Content',
      });

      const mockInvitation = await prismaService.documentInvitation.create({
        data: {
          documentId: mockDocument.id,
          userId: mockUserToInvite1.id,
        },
      });

      const response = await request(app.getHttpServer())
        .patch(
          `/document/${mockDocument.id}/invitation/${mockInvitation.id}/accept`,
        )
        .set('Authorization', `Bearer ${mockUserToInvite2Token}`)
        .expect(403);

      expect(response.body.errorCode).toBe('FORBIDDEN_EXCEPTION');

      expect(await prismaService.documentInvitation.findMany()).toHaveLength(1);
    });

    it('should not work if a user isnt logged in', async () => {
      const mockUser = await userService.create({
        name: 'Mock User',
      });
      const mockUserToken = await authService.generateTokenForUser(mockUser);

      const mockUserToInvite1 = await userService.create({
        name: 'Invited Mock User 1',
      });

      const mockDocument = await documentService.create(mockUser.id, {
        content: 'Test Content',
      });

      const mockInvitation = await prismaService.documentInvitation.create({
        data: {
          documentId: mockDocument.id,
          userId: mockUserToInvite1.id,
        },
      });

      const response = await request(app.getHttpServer())
        .patch(
          `/document/${mockDocument.id}/invitation/${mockInvitation.id}/accept`,
        )
        //.set('Authorization', `Bearer ${mockUserToken}`)
        .expect(401);
    });
  });
});
