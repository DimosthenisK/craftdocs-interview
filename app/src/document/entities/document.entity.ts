import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { Document } from '@prisma/client';
import { UserEntity } from '../../user/entities/user.entity';
import { BaseEntity } from '../../util/base.entity';
import { DocumentInvitationEntity } from '../invitation/entities/DocumentInvitation.entity';
import { DocumentSubscriptionEntity } from '../subscription/entities/document-subscription.entity';

@ApiExtraModels(
  () => DocumentSubscriptionEntity,
  () => DocumentInvitationEntity,
)
export class DocumentEntity extends BaseEntity implements Document {
  content: string;

  @ApiProperty({ type: () => UserEntity })
  owner: UserEntity;
  ownerId: string;

  @ApiProperty({ type: () => DocumentSubscriptionEntity, isArray: true })
  subscriptions: DocumentSubscriptionEntity[];

  @ApiProperty({ type: () => DocumentInvitationEntity, isArray: true })
  invitations: DocumentInvitationEntity[];
}
