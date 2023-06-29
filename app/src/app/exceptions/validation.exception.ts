import { BadRequestException } from '@nestjs/common';

export interface ValidationExceptionParameters {
  errors: { [key: string]: string };
}

export class ValidationException extends BadRequestException {
  constructor({ errors }: ValidationExceptionParameters) {
    super({
      statusCode: 400,
      error: 'Bad Request',
      errorCode: 'VALIDATION_EXCEPTION',
      errors,
    });
  }
}
