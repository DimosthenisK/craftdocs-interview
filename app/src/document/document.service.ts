import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentSubscriptionService } from './subscription/document-subscription.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly documentSubscriptionService: DocumentSubscriptionService,
  ) {}

  async create(ownerId: string, createDocumentDto: CreateDocumentDto) {
    const document = await this.prismaService.document.create({
      data: { ...createDocumentDto, ownerId },
    });

    await this.documentSubscriptionService.subscribeToDocument(
      document.id,
      ownerId,
    );

    return document;
  }

  findOne(id: string) {
    return this.prismaService.document.findUnique({ where: { id } });
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.prismaService.document.update({
      where: { id },
      data: updateDocumentDto,
    });

    this.documentSubscriptionService.broadcastDocumentUpdate(id);

    return document;
  }

  async remove(id: string) {
    const document = await this.prismaService.document.delete({
      where: { id },
    });

    await this.documentSubscriptionService.unsubscribeFromDocument(document.id);

    return document;
  }
}
