import { ValidationException } from '../exceptions';
import { ValidationPipe } from '@nestjs/common';

export const appValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: (errors) => {
    const validationErrors = {};

    const traverseError = (error, parentPath = '') => {
      const propertyPath = parentPath
        ? `${parentPath}.${error.property}`
        : error.property;

      if (error.constraints) {
        validationErrors[propertyPath] = Object.values(error.constraints).join(
          ', ',
        );
      }

      if (error.children && error.children.length > 0) {
        error.children.forEach((childError) =>
          traverseError(childError, propertyPath),
        );
      }
    };

    for (const error of errors) {
      traverseError(error);
    }

    throw new ValidationException({
      errors: validationErrors,
    });
  },
});
