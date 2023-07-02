import { Module, forwardRef } from '@nestjs/common';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { BearerAuthGuard } from './guards/bearer.guard';
import { HttpStrategy } from './authentication.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user.module';

@Module({
  imports: [PassportModule, forwardRef(() => UserModule)],
  providers: [AuthenticationService, HttpStrategy, BearerAuthGuard],
  controllers: [AuthenticationController],
  exports: [AuthenticationService, PassportModule, BearerAuthGuard],
})
export class AuthenticationModule {}
