import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';
import { AuthenticatedRequest } from '../../../app/types';
import { DocumentSubscriptionService } from '../document-subscription.service';

@Injectable()
export class IsSubscribedToDocumentGuard implements CanActivate {
  constructor(
    private readonly documentSubscriptionService: DocumentSubscriptionService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    const documentId = request.params.documentId;

    return this.documentSubscriptionService.isSubscribedToDocument(
      documentId,
      user.id,
    );
  }
}
