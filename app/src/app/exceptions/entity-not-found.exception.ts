import { NotFoundException } from '@nestjs/common';

export interface EntityNotFoundExceptionParameters {
  entity: string;
}

export class EntityNotFoundException extends NotFoundException {
  constructor({ entity }: EntityNotFoundExceptionParameters) {
    super({
      statusCode: 404,
      error: 'Not Found',
      errorCode: 'ENTITY_DOESNT_EXIST_EXCEPTION',
      entity,
      message: `${entity} doesn't exist`,
    });
  }
}
