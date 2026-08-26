import { AppError } from './AppError'
import { ErrorCode } from './errorCodes'

export class InternNotInScopeError extends AppError {
  constructor() {
    super(403, ErrorCode.INTERN_NOT_IN_SCOPE, 'This intern is not in your scope')
  }
}
