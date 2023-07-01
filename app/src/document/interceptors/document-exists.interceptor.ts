import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { DocumentService } from '../document.service';
import { EntityNotFoundException } from '../../app/exceptions';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class DocumentExistsInterceptor implements NestInterceptor {
  constructor(private readonly documentService: DocumentService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const documentId = request.params.documentId || request.body.documentId;

    const document = await this.documentService.findOne(documentId);
    if (!document) {
      throw new EntityNotFoundException({ entity: 'Document' });
    }

    return next.handle();
  }
}
