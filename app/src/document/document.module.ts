import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentSubscriptionModule } from './subscription/document-subscription.module';
import { Module } from '@nestjs/common';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService],
  imports: [DocumentSubscriptionModule],
})
export class DocumentModule {}
