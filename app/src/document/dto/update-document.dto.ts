import { IsNotEmpty, IsString, Length } from 'class-validator';

import { CreateDocumentDto } from './create-document.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @IsString()
  @IsNotEmpty()
  @Length(1, 65534)
  content: string;
}
