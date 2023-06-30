import { Module, forwardRef } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { HttpStrategy } from './authentication.strategy';
import { BearerAuthGuard } from './guards/bearer.guard';

@Module({
  imports: [PassportModule, forwardRef(() => UserModule)],
  providers: [AuthenticationService, HttpStrategy, BearerAuthGuard],
  exports: [AuthenticationService, PassportModule, BearerAuthGuard],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
