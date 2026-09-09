import { ErrorCode } from './errorCodes'

export class AppError extends Error {
  statusCode: number
  code: string

  constructor(statusCode: number, code: string, message: string) {
    super(message)
    this.name = new.target.name
    this.statusCode = statusCode
    this.code = code
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, ErrorCode.VALIDATION_ERROR, message)
  }
}

export class NotAuthenticatedError extends AppError {
  constructor(message = 'Not authenticated') {
    super(401, ErrorCode.NOT_AUTHENTICATED, message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(403, ErrorCode.INSUFFICIENT_PERMISSIONS, message)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, ErrorCode.NOT_FOUND, message)
  }
}
