import { AppError } from './AppError'
import { ErrorCode } from './errorCodes'

export class TaskNotAssignedError extends AppError {
  constructor() {
    super(
      403,
      ErrorCode.TASK_NOT_ASSIGNED,
      'You are not assigned to this task'
    )
  }
}

export class SubmissionNotAllowedError extends AppError {
  constructor() {
    super(
      400,
      ErrorCode.SUBMISSION_NOT_ALLOWED,
      'A pending or approved submission already exists for this task'
    )
  }
}

export class InvalidFileTypeError extends AppError {
  constructor(mimetype: string) {
    super(
      400,
      ErrorCode.INVALID_FILE_TYPE,
      `File type "${mimetype}" is not allowed`
    )
  }
}
