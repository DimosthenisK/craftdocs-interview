import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UserService } from '../user.service';
import { WsException } from '@nestjs/websockets';
import { tokenInfo } from './authentication.service';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'wsjwt') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('bearerToken'),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate({ id, name }: tokenInfo): Promise<User> {
    try {
      return this.userService.findOneByName(name);
    } catch (error) {
      throw new WsException('Unauthorized access');
    }
  }
}
