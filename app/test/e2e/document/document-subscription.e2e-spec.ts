import { CacheModule } from '@nestjs/cache-manager';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { io } from 'socket.io-client';
import { DocumentModule } from '../../../src/document/document.module';
import { DocumentService } from '../../../src/document/document.service';
import { DocumentSubscriptionGateway } from '../../../src/document/subscription/document-subscription.gateway';
import { DocumentSubscriptionService } from '../../../src/document/subscription/document-subscription.service';
import { PrismaModule } from '../../../src/prisma/prisma.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { AuthenticationService } from '../../../src/user/authentication/authentication.service';
import { UserModule } from '../../../src/user/user.module';
import { UserService } from '../../../src/user/user.service';
import { buildTest } from '../helpers';

describe('DocumentSubscriptionGateway (e2e)', () => {
  jest.setTimeout(600000);
  const testID = `document-subscription-container-test`;

  let app: INestApplication;
  let prismaService: PrismaService;
  let authService: AuthenticationService;
  let userService: UserService;
  let documentService: DocumentService;
  let documentSubscriptionGateway: DocumentSubscriptionGateway;

  let beforeAllFn: () => Promise<void>;
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
    documentSubscriptionGateway = app.get(DocumentSubscriptionGateway);

    beforeAllFn = test.beforeAll;
    afterAllFn = test.afterAll;
    beforeEachFn = test.beforeEach;
    afterEachFn = test.afterEach;
  });

  beforeAll(async () => {
    await beforeAllFn();
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

  describe('Connection', () => {
    it('should be able to accept connections', (done) => {
      const asyncStartTest = async () => {
        const mockUser = await userService.create({
          name: 'Mock User',
        });
        const mockUserToken = await authService.generateTokenForUser(mockUser);

        const mockUser2 = await userService.create({
          name: 'Mock User 2',
        });
        const mockUserToken2 = await authService.generateTokenForUser(
          mockUser2,
        );

        const mockDocument = await documentService.create(mockUser.id, {
          content: 'Test Content',
        });

        const mockInvitation = await prismaService.documentInvitation.create({
          data: {
            documentId: mockDocument.id,
            userId: mockUser2.id,
            accepted: true,
          },
        });

        const mockSubscription =
          await prismaService.documentSubscription.create({
            data: {
              documentId: mockDocument.id,
              userId: mockUser2.id,
            },
          });

        return mockUserToken2;
      };

      asyncStartTest().then((mockUserToken2) => {
        const address = app.getHttpServer().address();
        const client = io(
          `ws://localhost:${address.port}/document-subscription`,
          {
            autoConnect: false,
            auth: {
              jwt: mockUserToken2,
            },
          },
        );
        client.on('connect', () => {
          if (client.connected) {
            expect(client.id).toBeDefined();
            client.close();
            done();
          }
        });

        client.on('connect_error', () => {
          throw new Error('failed to connect');
        });

        client.connect();
      });
    });

    it('should connect immediately to subscribed documents', (done) => {
      const asyncStartTest = async () => {
        const mockUser = await userService.create({
          name: 'Mock User',
        });
        const mockUserToken = await authService.generateTokenForUser(mockUser);

        const mockUser2 = await userService.create({
          name: 'Mock User 2',
        });
        const mockUserToken2 = await authService.generateTokenForUser(
          mockUser2,
        );

        const mockDocument = await documentService.create(mockUser.id, {
          content: 'Test Content',
        });

        const mockInvitation = await prismaService.documentInvitation.create({
          data: {
            documentId: mockDocument.id,
            userId: mockUser2.id,
            accepted: true,
          },
        });

        const mockSubscription =
          await prismaService.documentSubscription.create({
            data: {
              documentId: mockDocument.id,
              userId: mockUser2.id,
            },
          });

        const mockDocument2 = await documentService.create(mockUser.id, {
          content: 'Test Content 2',
        });

        const mockInvitation2 = await prismaService.documentInvitation.create({
          data: {
            documentId: mockDocument2.id,
            userId: mockUser2.id,
            accepted: true,
          },
        });

        const mockSubscription2 =
          await prismaService.documentSubscription.create({
            data: {
              documentId: mockDocument2.id,
              userId: mockUser2.id,
            },
          });

        return {
          token: mockUserToken2,
          subscriptions: [mockSubscription, mockSubscription2],
        };
      };

      asyncStartTest().then((data) => {
        const address = app.getHttpServer().address();
        const client = io(
          `ws://localhost:${address.port}/document-subscription`,
          {
            autoConnect: false,
            auth: {
              jwt: data.token,
            },
          },
        );
        client.on('connect', () => {
          expect(client.id).toBeDefined();
        });

        client.on('new-subscription', (documentId) => {
          expect(
            data.subscriptions.find(
              (mockSubscription) => mockSubscription.documentId === documentId,
            ),
          ).toBeTruthy();
          client.close();
          done();
        });

        client.on('connect_error', () => {
          throw new Error('failed to connect');
        });

        client.connect();
      });
    });

    it('should join a room when a subscription is created', (done) => {
      const asyncStartTest = async () => {
        const mockUser = await userService.create({
          name: 'Mock User',
        });
        const mockUserToken = await authService.generateTokenForUser(mockUser);

        const mockUser2 = await userService.create({
          name: 'Mock User 2',
        });
        const mockUserToken2 = await authService.generateTokenForUser(
          mockUser2,
        );

        const mockDocument = await documentService.create(mockUser.id, {
          content: 'Test Content',
        });

        const mockInvitation = await prismaService.documentInvitation.create({
          data: {
            documentId: mockDocument.id,
            userId: mockUser2.id,
          },
        });

        return {
          token: mockUserToken2,
          mockInvitation,
        };
      };

      asyncStartTest().then((data) => {
        const address = app.getHttpServer().address();
        const client = io(
          `ws://localhost:${address.port}/document-subscription`,
          {
            autoConnect: false,
            auth: {
              jwt: data.token,
            },
          },
        );
        client.on('connect', () => {
          expect(client.id).toBeDefined();

          app
            .get(DocumentSubscriptionService)
            .subscribeToDocument(
              data.mockInvitation.documentId,
              data.mockInvitation.userId,
            );
        });

        client.on('new-subscription', (documentId) => {
          expect(data.mockInvitation.documentId).toBe(documentId);
          client.close();
          done();
        });

        client.on('connect_error', () => {
          throw new Error('failed to connect');
        });

        client.connect();
      });
    });

    it('should receive changes on document update', (done) => {
      const asyncStartTest = async () => {
        const mockUser = await userService.create({
          name: 'Mock User',
        });
        const mockUserToken = await authService.generateTokenForUser(mockUser);

        const mockUser2 = await userService.create({
          name: 'Mock User 2',
        });
        const mockUserToken2 = await authService.generateTokenForUser(
          mockUser2,
        );

        const mockDocument = await documentService.create(mockUser.id, {
          content: 'Test Content',
        });

        const mockInvitation = await prismaService.documentInvitation.create({
          data: {
            documentId: mockDocument.id,
            userId: mockUser2.id,
            accepted: true,
          },
        });

        const mockSubscription =
          await prismaService.documentSubscription.create({
            data: {
              documentId: mockDocument.id,
              userId: mockUser2.id,
            },
          });

        return {
          token: mockUserToken2,
          mockSubscription,
        };
      };

      asyncStartTest().then((data) => {
        const address = app.getHttpServer().address();
        const client = io(
          `ws://localhost:${address.port}/document-subscription`,
          {
            autoConnect: false,
            auth: {
              jwt: data.token,
            },
          },
        );
        client.on('connect', () => {
          expect(client.id).toBeDefined();

          app.get(DocumentService).update(data.mockSubscription.documentId, {
            content: 'Test Content 2',
          });
        });

        client.on('document-changed', (document) => {
          expect(document.id).toBe(data.mockSubscription.documentId);
          expect(document.content).toBe('Test Content 2');
          client.close();
          done();
        });

        client.on('connect_error', () => {
          throw new Error('failed to connect');
        });

        client.connect();
      });
    });
  });
});
