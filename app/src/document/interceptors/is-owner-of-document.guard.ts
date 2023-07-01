import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthenticatedRequest } from '../../app/types';
import { DocumentService } from '../document.service';

@Injectable()
export class IsOwnerOfDocumentGuard implements CanActivate {
  constructor(private readonly documentService: DocumentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    const documentId = request.params.documentId;
    const document = await this.documentService.findOne(documentId);

    return document.ownerId === user.id;
  }
}
