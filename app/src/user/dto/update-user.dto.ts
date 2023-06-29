import { IsNotEmpty, IsString, Length } from 'class-validator';

import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(1, 64)
  @IsNotEmpty()
  name: string;
}
