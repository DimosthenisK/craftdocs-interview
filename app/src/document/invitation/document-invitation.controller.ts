import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BearerAuthGuard } from '../../user/authentication/guards/bearer.guard';
import { UserExistsInterceptor } from '../../user/interceptors/user-exists.interceptor';
import { DocumentExistsInterceptor } from '../interceptors/document-exists.interceptor';
import { IsOwnerOfDocumentGuard } from '../interceptors/is-owner-of-document.guard';
import { DocumentInvitationService } from './document-invitation.service';
import { InviteUserDto } from './dto/invite-user.dto';
import { DocumentInvitationEntity } from './entities/DocumentInvitation.entity';
import { DocumentInvitationExistsInterceptor } from './interceptors/document-invitation-exists.interceptor';

@ApiTags('Document')
@ApiBearerAuth('bearer')
@UseGuards(BearerAuthGuard)
@Controller('document/:documentId/invitation')
export class DocumentInvitationController {
  constructor(
    private readonly documentInvitationService: DocumentInvitationService,
  ) {}

  @Post()
  @UseGuards(IsOwnerOfDocumentGuard)
  @UseInterceptors(DocumentExistsInterceptor, UserExistsInterceptor)
  @ApiCreatedResponse({ type: DocumentInvitationEntity })
  async inviteUserToDocument(
    @Param('documentId') documentId: string,
    @Body() body: InviteUserDto,
  ) {
    return this.documentInvitationService.inviteUserToDocument(
      body.userId,
      documentId,
    );
  }

  @Patch(':invitationId/accept')
  @UseInterceptors(
    DocumentExistsInterceptor,
    DocumentInvitationExistsInterceptor,
  )
  @UseGuards(IsOwnerOfDocumentGuard)
  @ApiOkResponse({ type: DocumentInvitationEntity })
  async acceptInvitation(@Param('invitationId') invitationId: string) {
    return this.documentInvitationService.acceptInvitationToDocument(
      invitationId,
    );
  }
}
