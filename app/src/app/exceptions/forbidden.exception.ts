import { ForbiddenException as HttpForbiddenException } from '@nestjs/common';

export interface ForbiddenExceptionParameters {
  entity: string;
}

export class ForbiddenException extends HttpForbiddenException {
  constructor({ entity }: ForbiddenExceptionParameters) {
    super({
      statusCode: 403,
      error: 'Forbidden',
      errorCode: 'FORBIDDEN_EXCEPTION',
      entity,
      message: `You are not allowed to access this ${entity}`,
    });
  }
}
