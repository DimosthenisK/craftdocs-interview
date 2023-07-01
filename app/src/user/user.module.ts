import { Module, forwardRef } from '@nestjs/common';

import { DocumentModule } from '../document/document.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => AuthenticationModule),
    forwardRef(() => DocumentModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
