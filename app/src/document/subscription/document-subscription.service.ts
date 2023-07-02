import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DocumentSubscriptionGateway } from './document-subscription.gateway';

@Injectable()
export class DocumentSubscriptionService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => DocumentSubscriptionGateway))
    private readonly documentSubscriptionGateway: DocumentSubscriptionGateway,
  ) {}

  async findSubscriptionsByDocumentId(documentId: string) {
    return this.prismaService.documentSubscription.findMany({
      where: { documentId },
    });
  }

  async findSubscriptionsByUserId(userId: string) {
    return this.prismaService.documentSubscription.findMany({
      where: { userId },
    });
  }

  async isSubscribedToDocument(documentId: string, userId: string) {
    const subscription =
      await this.prismaService.documentSubscription.findFirst({
        where: { documentId, userId },
      });
    return !!subscription;
  }

  async subscribeToDocument(documentId: string, userId: string) {
    return this.prismaService.documentSubscription.create({
      data: {
        documentId,
        userId,
      },
    });
  }

  async unsubscribeFromDocument(subscriptionId: string) {
    return this.prismaService.documentSubscription.delete({
      where: { id: subscriptionId },
    });
  }

  broadcastDocumentUpdate(documentId: string) {
    this.documentSubscriptionGateway.acknowledgeChange(documentId);
  }
}
