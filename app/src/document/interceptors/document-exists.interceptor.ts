import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Request } from 'express';
import { Observable } from 'rxjs';
import { EntityNotFoundException } from '../../app/exceptions';
import { DocumentService } from '../document.service';

@Injectable()
export class DocumentExistsInterceptor implements NestInterceptor {
  constructor(private readonly documentService: DocumentService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const documentId = request.params.documentId;

    const document = await this.documentService.findOne(documentId);
    if (!document) {
      throw new EntityNotFoundException({ entity: 'Document' });
    }

    return next.handle();
  }
}
