import { DocumentInvitation } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../user/entities/user.entity';
import { BaseEntity } from '../../../util/base.entity';
import { DocumentEntity } from '../../entities/document.entity';

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
