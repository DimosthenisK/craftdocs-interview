import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { BearerAuthGuard } from '../user/authentication/guards/bearer.guard';
import { CurrentUser } from '../user/decorators';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { IsOwnerOfDocumentGuard } from './interceptors/is-owner-of-document.guard';
import { IsSubscribedToDocumentGuard } from './subscription/guards/is-subscribed-to-document.guard';

@ApiBearerAuth('bearer')
@UseGuards(BearerAuthGuard)
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    return this.documentService.create(user.id, createDocumentDto);
  }

  @Get(':documentId')
  @UseGuards(IsSubscribedToDocumentGuard)
  findOne(@Param('documentId') id: string) {
    return this.documentService.findOne(id);
  }

  @Patch(':documentId')
  @UseGuards(IsSubscribedToDocumentGuard)
  update(
    @Param('documentId') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(id, updateDocumentDto);
  }

  @Delete(':documentId')
  @UseGuards(IsOwnerOfDocumentGuard)
  remove(@Param('documentId') id: string) {
    return this.documentService.remove(id);
  }
}
