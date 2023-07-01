import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthenticatedRequest } from '../../../app/types';
import { DocumentInvitationService } from '../document-invitation.service';

@Injectable()
export class IsOwnDocumentInvitationGuard implements CanActivate {
  constructor(
    private readonly documentInvitationService: DocumentInvitationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    const invitationId = request.params.invitationId;
    const invitation = await this.documentInvitationService.findOne(
      invitationId,
    );

    return invitation.userId === user.id;
  }
}
