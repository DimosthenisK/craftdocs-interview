import { AuthSocket, SocketMiddleware } from '../../../app/types';

import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { WsException } from '@nestjs/websockets';
import { tokenInfo } from '../authentication.service';

export const AuthenticationWSMiddleware = (
  jwtService: JwtService,
  userService: UserService,
): SocketMiddleware => {
  return async (socket: AuthSocket, next) => {
    try {
      const jwtPayload = jwtService.verify(
        socket.handshake.auth.jwt ?? '',
      ) as tokenInfo;
      const user = await userService.findOne(jwtPayload.id);

      if (!user) throw new Error('Unauthorized');

      socket.user = user;
      next();
    } catch (err) {
      throw new WsException(err);
    }
  };
};
