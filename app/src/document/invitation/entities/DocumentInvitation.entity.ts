import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

import { DocumentInvitation } from '@prisma/client';
import { UserEntity } from '../../../user/entities/User.entity';
import { BaseEntity } from '../../../util/base.entity';
import { DocumentEntity } from '../../entities/Document.entity';

@ApiExtraModels(() => DocumentEntity, () => UserEntity)
export class DocumentInvitationEntity
  extends BaseEntity
  implements DocumentInvitation
{
  accepted: boolean;

  @ApiProperty({ type: () => DocumentEntity })
  document: DocumentEntity;
  documentId: string;

  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;
  userId: string;
}
