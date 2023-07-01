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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { BearerAuthGuard } from '../user/authentication/guards/bearer.guard';
import { CurrentUser } from '../user/decorators';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentEntity } from './entities/document.entity';
import { IsOwnerOfDocumentGuard } from './interceptors/is-owner-of-document.guard';
import { IsSubscribedToDocumentGuard } from './subscription/guards/is-subscribed-to-document.guard';

@ApiTags('Document')
@ApiBearerAuth('bearer')
@UseGuards(BearerAuthGuard)
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @ApiCreatedResponse({ type: DocumentEntity })
  create(
    @CurrentUser() user: User,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    return this.documentService.create(user.id, createDocumentDto);
  }

  @Get(':documentId')
  @UseGuards(IsSubscribedToDocumentGuard)
  @ApiOkResponse({ type: DocumentEntity })
  findOne(@Param('documentId') id: string) {
    return this.documentService.findOne(id);
  }

  @Patch(':documentId')
  @UseGuards(IsSubscribedToDocumentGuard)
  @ApiOkResponse({ type: DocumentEntity })
  update(
    @Param('documentId') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(id, updateDocumentDto);
  }

  @Delete(':documentId')
  @UseGuards(IsOwnerOfDocumentGuard)
  @ApiOkResponse({ type: DocumentEntity })
  remove(@Param('documentId') id: string) {
    return this.documentService.remove(id);
  }
}
