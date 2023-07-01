import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { User } from '@prisma/client';
import { DocumentInvitationEntity } from '../../document/invitation/entities/DocumentInvitation.entity';
import { DocumentSubscriptionEntity } from '../../document/subscription/entities/DocumentSubscription.entity';
import { BaseEntity } from '../../util/base.entity';

@ApiExtraModels(
  () => DocumentSubscriptionEntity,
  () => DocumentInvitationEntity,
)
export class UserEntity extends BaseEntity implements User {
  name: string;

  @ApiProperty({ type: () => DocumentSubscriptionEntity, isArray: true })
  subscriptions: DocumentSubscriptionEntity[];

  @ApiProperty({ type: () => DocumentInvitationEntity, isArray: true })
  invitations: DocumentInvitationEntity[];
}
