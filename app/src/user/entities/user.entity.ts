import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../util/base.entity';
import { DocumentSubscriptionEntity } from '../../document/subscription/entities/document-subscription.entity';
import { User } from '@prisma/client';

export class UserEntity extends BaseEntity implements User {
  name: string;

  @ApiProperty({ type: () => DocumentSubscriptionEntity, isArray: true })
  subscriptions: DocumentSubscriptionEntity[];
}
