import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthenticatedRequest } from '../../app/types';
import { DocumentService } from '../document.service';
import { ForbiddenException } from '../../app/exceptions';

@Injectable()
export class IsOwnerOfDocumentGuard implements CanActivate {
  constructor(private readonly documentService: DocumentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    const documentId = request.params.documentId;
    const document = await this.documentService.findOne(documentId);

    if (document.ownerId !== user.id)
      throw new ForbiddenException({ entity: 'Document' });

    return true;
  }
}
