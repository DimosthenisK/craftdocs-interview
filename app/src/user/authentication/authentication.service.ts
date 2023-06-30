import * as jwt from 'jsonwebtoken';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { UserService } from '../user.service';

export interface tokenInfo {
  id: string;
  name: string;
}

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(token: string): Promise<User> {
    let tokenInfo;
    try {
      tokenInfo = jwt.verify(
        token,
        this.configService.get('JWT_SECRET'),
      ) as tokenInfo;
    } catch (err) {
      throw err;
    }
    return await this.usersService.findOne(tokenInfo.id);
  }

  async generateTokenForUser(user: User, expiration?: string): Promise<string> {
    expiration = expiration
      ? expiration
      : this.configService.get('DEFAULT_TOKEN_EXPIRATION_INTERVAL') || '7d';
    return jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      this.configService.get('JWT_SECRET'),
      { expiresIn: expiration },
    );
  }

  /**
   * Under a production environment, this method should be modified to
   * support password authentication.
   * Here, we just check if a user with $name exists, and if he does, we log him in.
   * If not, we create him and log him in.
   */
  async login(name: string) {
    let user = await this.usersService.findOneByName(name);
    if (!user) {
      user = await this.usersService.create({ name });
    }

    return this.generateTokenForUser(user);
  }

  async checkToken(token: string) {
    let user;
    try {
      user = await this.validateUser(token);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw new Error('Token signature seems invalid or otherwise modified');
      } else {
        throw new Error('An unknown error has occured.');
      }
    }

    if (user) return this.generateTokenForUser(user);
    else throw new Error('User not found');
  }
}
