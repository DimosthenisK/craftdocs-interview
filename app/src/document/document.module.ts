import { Module, forwardRef } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { DocumentController } from './document.controller';
import { DocumentExistsInterceptor } from './interceptors/document-exists.interceptor';
import { DocumentInvitationController } from './invitation/document-invitation.controller';
import { DocumentInvitationExistsInterceptor } from './invitation/interceptors/document-invitation-exists.interceptor';
import { DocumentInvitationService } from './invitation/document-invitation.service';
import { DocumentService } from './document.service';
import { DocumentSubscriptionGateway } from './subscription/document-subscription.gateway';
import { DocumentSubscriptionService } from './subscription/document-subscription.service';
import { IsOwnDocumentInvitationGuard } from './invitation/guards/is-own-document-invitation.guard';
import { IsOwnerOfDocumentGuard } from './interceptors/is-owner-of-document.guard';
import { IsSubscribedToDocumentGuard } from './subscription/guards/is-subscribed-to-document.guard';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
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
  exports: [
    DocumentService,
    DocumentInvitationService,
    DocumentSubscriptionService,
    DocumentSubscriptionGateway,
  ],
})
export class DocumentModule {}
