import { IsString, Length } from 'class-validator';

export class InviteUserDto {
  @IsString()
  @Length(21, 21)
  userId: string;
}
