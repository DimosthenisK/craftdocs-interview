import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService],
  imports: [SubscriptionModule]
})
export class DocumentModule {}
