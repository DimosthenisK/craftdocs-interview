import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Request } from 'express';
import { Observable } from 'rxjs';
import { EntityNotFoundException } from '../../../app/exceptions';
import { DocumentInvitationService } from '../document-invitation.service';

@Injectable()
export class DocumentInvitationExistsInterceptor implements NestInterceptor {
  constructor(
    private readonly documentInvitationService: DocumentInvitationService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const invitationId =
      request.params.invitationId || request.body.invitationId;

    const invitation = await this.documentInvitationService.findOne(
      invitationId,
    );
    if (!invitation) {
      throw new EntityNotFoundException({ entity: 'Document Invitation' });
    }

    return next.handle();
  }
}
