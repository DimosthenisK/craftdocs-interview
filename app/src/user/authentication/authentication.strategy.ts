import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';

@Injectable()
export class HttpStrategy extends PassportStrategy(
  Strategy,
  'user-authentication',
) {
  constructor(private readonly authService: AuthenticationService) {
    super();
  }

  async validate(token: string) {
    try {
      const user = await this.authService.validateUser(token);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
