import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentSubscriptionService } from './subscription/document-subscription.service';

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

  update(id: string, updateDocumentDto: UpdateDocumentDto) {
    return this.prismaService.document.update({
      where: { id },
      data: updateDocumentDto,
    });
  }

  remove(id: string) {
    return this.prismaService.document.delete({ where: { id } });
  }
}
