import { AppError } from './AppError'
import { ErrorCode } from './errorCodes'

export class InternNotOnProjectError extends AppError {
  constructor() {
    super(
      400,
      ErrorCode.INTERN_NOT_ON_PROJECT,
      "Intern must be assigned to the task's project first"
    )
  }
}
