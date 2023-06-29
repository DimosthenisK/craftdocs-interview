import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 65534)
  content: string;
}
