import { Module, forwardRef } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentExistsInterceptor } from './interceptors/document-exists.interceptor';
import { IsOwnerOfDocumentGuard } from './interceptors/is-owner-of-document.guard';
import { DocumentInvitationController } from './invitation/document-invitation.controller';
import { DocumentInvitationService } from './invitation/document-invitation.service';
import { IsOwnDocumentInvitationGuard } from './invitation/guards/is-own-document-invitation.guard';
import { DocumentInvitationExistsInterceptor } from './invitation/interceptors/document-invitation-exists.interceptor';
import { DocumentSubscriptionGateway } from './subscription/document-subscription.gateway';
import { DocumentSubscriptionService } from './subscription/document-subscription.service';
import { IsSubscribedToDocumentGuard } from './subscription/guards/is-subscribed-to-document.guard';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [DocumentController, DocumentInvitationController],
  providers: [
    DocumentService,
    DocumentInvitationService,
    DocumentSubscriptionService,

    DocumentExistsInterceptor,
    DocumentInvitationExistsInterceptor,

    IsSubscribedToDocumentGuard,
    IsOwnerOfDocumentGuard,
    IsOwnDocumentInvitationGuard,

    DocumentSubscriptionGateway,
  ],
  exports: [DocumentService],
})
export class DocumentModule {}
