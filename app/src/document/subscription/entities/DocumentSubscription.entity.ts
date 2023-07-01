import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { DocumentSubscription } from '@prisma/client';
import { UserEntity } from '../../../user/entities/User.entity';
import { BaseEntity } from '../../../util/base.entity';
import { DocumentEntity } from '../../entities/Document.entity';

@ApiExtraModels(() => DocumentEntity, () => UserEntity)
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
