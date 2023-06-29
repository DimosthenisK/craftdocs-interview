import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 64)
  @IsNotEmpty()
  name: string;
}
