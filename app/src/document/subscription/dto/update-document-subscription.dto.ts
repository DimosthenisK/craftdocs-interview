import { IsNotEmpty, IsString, Length } from 'class-validator';

import { CreateDocumentSubscriptionDto } from './create-document-subscription.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateDocumentSubscriptionDto extends PartialType(
  CreateDocumentSubscriptionDto,
) {
  @IsString()
  @Length(21, 21)
  @IsNotEmpty()
  documentId: string;
}
