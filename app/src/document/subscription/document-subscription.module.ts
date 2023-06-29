import { Module } from '@nestjs/common';
import { DocumentSubscriptionService } from './document-subscription.service';
import { DocumentSubscriptionGateway } from './document-subscription.gateway';

@Module({
  providers: [DocumentSubscriptionGateway, DocumentSubscriptionService]
})
export class DocumentSubscriptionModule {}
