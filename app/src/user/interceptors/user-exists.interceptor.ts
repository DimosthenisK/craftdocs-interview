import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Request } from 'express';
import { Observable } from 'rxjs';
import { EntityNotFoundException } from '../../app/exceptions';
import { UserService } from '../user.service';

@Injectable()
export class UserExistsInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.params.userId || request.body.userId;

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new EntityNotFoundException({ entity: 'User' });
    }

    return next.handle();
  }
}
