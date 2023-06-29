import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentSubscriptionDto } from './create-document-subscription.dto';

export class UpdateDocumentSubscriptionDto extends PartialType(CreateDocumentSubscriptionDto) {
  id: number;
}
