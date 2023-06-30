import { Length } from 'class-validator';

export class CheckTokenDto {
  @Length(1, 1000)
  token: string;
}
