import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthenticatedRequest } from '../../../app/types';
import { DocumentInvitationService } from '../document-invitation.service';
import { ForbiddenException } from '../../../app/exceptions';

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

    if (!invitation) {
      // Invitation doesn't exist - continue in order for the interceptor to catch and return 404
      return true;
    }

    if (invitation.userId !== user.id)
      throw new ForbiddenException({ entity: 'Document Invitation' });

    return true;
  }
}
