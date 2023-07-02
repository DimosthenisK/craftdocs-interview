import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, UseGuards, forwardRef } from '@nestjs/common';
import { User } from '@prisma/client';
import { Cache } from 'cache-manager';
import { WsAuthGuard } from '../../user/authentication/guards/ws.guard';
import { DocumentService } from '../document.service';
import { DocumentSubscriptionService } from './document-subscription.service';

@WebSocketGateway({
  namespace: 'document-subscription',
})
@UseGuards(WsAuthGuard)
export class DocumentSubscriptionGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => DocumentSubscriptionService))
    private readonly documentSubscriptionService: DocumentSubscriptionService,
    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async afterInit(server: Server) {
    console.log('Listening');
    const socketToUserMap = await this.cacheManager.get('socket-to-user-map');
    if (!socketToUserMap)
      await this.cacheManager.set('socket-to-user-map', {}, 0);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const user: User = (client?.handshake as any)?.user;

    const socketToUserMap = await this.cacheManager.get<{
      [key: string]: string;
    }>('socket-to-user-map');
    socketToUserMap[user.id] = undefined;
    await this.cacheManager.set('socket-to-user-map', socketToUserMap, 0);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    const user: User = (client?.handshake as any)?.user;

    const socketToUserMap = await this.cacheManager.get<{
      [key: string]: string;
    }>('socket-to-user-map');
    socketToUserMap[user.id] = client.id;
    await this.cacheManager.set('socket-to-user-map', socketToUserMap, 0);
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
