import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateDocumentSubscriptionDto {
  @IsString()
  @Length(21, 21)
  @IsNotEmpty()
  documentId: string;
}
