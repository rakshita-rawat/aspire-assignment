const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
} as const;

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly field?: string) {
    super(message, ERROR_CODES.VALIDATION_ERROR, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with id ${identifier} not found`
      : `${resource} not found`;
    super(message, ERROR_CODES.NOT_FOUND, 404);
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    service: string,
    message: string,
    public readonly originalError?: Error
  ) {
    super(
      `External service error (${service}): ${message}`,
      ERROR_CODES.EXTERNAL_SERVICE_ERROR,
      502
    );
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, public readonly originalError?: Error) {
    super(`Database error: ${message}`, ERROR_CODES.DATABASE_ERROR, 500);
  }
}
