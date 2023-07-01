import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DocumentSubscriptionService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
