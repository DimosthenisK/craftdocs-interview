import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DocumentSubscriptionService } from '../subscription/document-subscription.service';

@Injectable()
export class DocumentInvitationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly documentSubscriptionService: DocumentSubscriptionService,
  ) {}

  findOne(id: string) {
    return this.prismaService.documentInvitation.findUnique({
      where: {
        id,
      },
    });
  }

  inviteUserToDocument(userId: string, documentId: string) {
    return this.prismaService.documentInvitation.create({
      data: {
        documentId,
        userId,
      },
    });
  }

  async acceptInvitationToDocument(invitationId: string) {
    const invitation = await this.prismaService.documentInvitation.update({
      where: {
        id: invitationId,
      },
      data: {
        accepted: true,
      },
    });

    await this.documentSubscriptionService.subscribeToDocument(
      invitation.documentId,
      invitation.userId,
    );

    return invitation;
  }

  findDocumentInvitations(documentId: string) {
    return this.prismaService.documentInvitation.findMany({
      where: {
        documentId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  findUserInvitations(userId: string) {
    return this.prismaService.documentInvitation.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
