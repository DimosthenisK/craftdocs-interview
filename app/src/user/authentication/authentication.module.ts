import { Module, forwardRef } from '@nestjs/common';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { BearerAuthGuard } from './guards/bearer.guard';
import { HttpStrategy } from './authentication.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user.module';
import { WsAuthGuard } from './guards/ws.guard';
import { WsJwtStrategy } from './authentication-ws.strategy';

@Module({
  imports: [PassportModule, forwardRef(() => UserModule)],
  providers: [
    AuthenticationService,
    HttpStrategy,
    BearerAuthGuard,
    WsJwtStrategy,
    WsAuthGuard,
  ],
  controllers: [AuthenticationController],
  exports: [
    AuthenticationService,
    PassportModule,
    BearerAuthGuard,
    WsAuthGuard,
  ],
})
export class AuthenticationModule {}
