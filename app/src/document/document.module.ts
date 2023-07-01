import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentExistsInterceptor } from './interceptors/document-exists.interceptor';
import { IsOwnerOfDocumentGuard } from './interceptors/is-owner-of-document.guard';
import { DocumentSubscriptionModule } from './subscription/document-subscription.module';

@Module({
  imports: [DocumentSubscriptionModule],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    DocumentExistsInterceptor,
    IsOwnerOfDocumentGuard,
  ],
  exports: [DocumentService],
})
export class DocumentModule {}
