import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../util/base.entity';
import { Document } from '@prisma/client';
import { DocumentSubscriptionEntity } from '../subscription/entities/document-subscription.entity';
import { UserEntity } from '../../user/entities/user.entity';

export class DocumentEntity extends BaseEntity implements Document {
  content: string;

  @ApiProperty({ type: () => UserEntity })
  owner: UserEntity;
  ownerId: string;

  @ApiProperty({ type: () => DocumentSubscriptionEntity, isArray: true })
  subscriptions: DocumentSubscriptionEntity[];
}
