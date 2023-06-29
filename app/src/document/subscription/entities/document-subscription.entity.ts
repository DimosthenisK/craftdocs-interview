import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../util/base.entity';
import { DocumentEntity } from '../../entities/document.entity';
import { DocumentSubscription } from '@prisma/client';
import { UserEntity } from '../../../user/entities/user.entity';

export class DocumentSubscriptionEntity
  extends BaseEntity
  implements DocumentSubscription
{
  lastSync: Date;

  @ApiProperty({ type: () => DocumentEntity })
  document: DocumentEntity;
  documentId: string;

  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;
  userId: string;
}
