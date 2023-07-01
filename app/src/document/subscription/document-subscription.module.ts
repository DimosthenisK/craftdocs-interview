import { Module } from '@nestjs/common';
import { DocumentSubscriptionGateway } from './document-subscription.gateway';
import { DocumentSubscriptionService } from './document-subscription.service';
import { IsSubscribedToDocumentGuard } from './guards/is-subscribed-to-document.guard';

@Module({
  providers: [
    DocumentSubscriptionGateway,
    DocumentSubscriptionService,
    IsSubscribedToDocumentGuard,
  ],
  exports: [DocumentSubscriptionService, IsSubscribedToDocumentGuard],
})
export class DocumentSubscriptionModule {}
