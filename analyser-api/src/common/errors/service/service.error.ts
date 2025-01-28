export class ServiceError extends Error {
  constructor(message = 'Something went wrong') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class EntityAlreadyExistsError extends ServiceError {
  constructor(entity: string) {
    super(`${entity} already exists!`);
  }
}

export class EntityNotFoundError extends ServiceError {
  constructor(entity: string) {
    super(`${entity} not found!`);
  }
}

export class EntityUpdateError extends ServiceError {
  constructor(entity: string) {
    super(`${entity} update failed!`);
  }
}

export class ForbiddenResourceError extends ServiceError {
  constructor(entity: string, source: string) {
    super(`${entity} is forbidden to access ${source}!`);
  }
}

export class BusinessRuleViolationError extends ServiceError {
  constructor(ruleName: string, message: string) {
    super(`Business rule violation [${ruleName}]: ${message}`);
  }
}

export class OperationNotPermittedError extends ServiceError {
  constructor(entity: string, operation: string) {
    super(`${operation} is not permitted on ${entity}!`);
  }
}

export class InvalidStateError extends ServiceError {
  constructor(entity: string, expectedState: string, actualState: string) {
    super(
      `${entity} is in an invalid state. Expected: ${expectedState}, but was: ${actualState}!`,
    );
  }
}

export class UniqueConstraintViolationError extends ServiceError {
  constructor(entity: string, field: string) {
    super(`${entity} with the same ${field} already exists!`);
  }
}
