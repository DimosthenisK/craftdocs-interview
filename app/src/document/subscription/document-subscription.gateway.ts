import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, UseGuards, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { UserService } from '../../user/user.service';
import { DocumentService } from '../document.service';
import { DocumentSubscriptionService } from './document-subscription.service';
import { AuthenticationWSMiddleware } from '../../user/authentication/middlewares/authentication-ws.middleware';
import { AuthSocket } from '../../app/types';

@WebSocketGateway({
  namespace: 'document-subscription',
})
export class DocumentSubscriptionGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => DocumentSubscriptionService))
    private readonly documentSubscriptionService: DocumentSubscriptionService,
    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async afterInit(server: Server) {
    console.log('Listening');
    const socketToUserMap = await this.cacheManager.get('socket-to-user-map');
    if (!socketToUserMap)
      await this.cacheManager.set('socket-to-user-map', {}, 0);

    const middleware = AuthenticationWSMiddleware(
      this.jwtService,
      this.userService,
    );
    server.use(middleware);
  }

  async handleDisconnect(client: AuthSocket) {
    console.log(`Client disconnected: ${client.id}`);

    const socketToUserMap = await this.cacheManager.get<{
      [key: string]: string;
    }>('socket-to-user-map');
    socketToUserMap[client.user.id] = undefined;
    await this.cacheManager.set('socket-to-user-map', socketToUserMap, 0);
  }

  async handleConnection(client: AuthSocket, ...args: any[]) {
    console.log(`Client connected: ${client.id}. User: ${client.user.id}`);

    const socketToUserMap = await this.cacheManager.get<{
      [key: string]: string;
    }>('socket-to-user-map');
    socketToUserMap[client.user.id] = client.id;
    await this.cacheManager.set('socket-to-user-map', socketToUserMap, 0);

    const subscriptions =
      await this.documentSubscriptionService.findSubscriptionsByUserId(
        client.user.id,
      );
    for (const subscription of subscriptions) {
      client.join(subscription.documentId);
    }
  }

  async subscribeToDocument(userId: string, documentId: string) {
    const socketToUserMap = await this.cacheManager.get<{
      [key: string]: string;
    }>('socket-to-user-map');
    const socketId = socketToUserMap[userId];
    if (socketId) {
      this.server.sockets.sockets.get(socketId).join(documentId);
    }
  }

  async unsubscribeFromDocument(userId: string, documentId: string) {
    const socketToUserMap = await this.cacheManager.get<{
      [key: string]: string;
    }>('socket-to-user-map');
    const socketId = socketToUserMap[userId];
    if (socketId) {
      this.server.sockets.sockets.get(socketId).leave(documentId);
    }
  }

  async acknowledgeChange(documentId: string) {
    const document = await this.documentService.findOne(documentId);
    this.server.to(documentId).emit('document-changed', document);
  }
}
