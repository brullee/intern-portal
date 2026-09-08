import { AppError } from './AppError'
import { ErrorCode } from './errorCodes'

export class PlanNotFoundError extends AppError {
  constructor() {
    super(404, ErrorCode.PLAN_NOT_FOUND, 'Plan not found')
  }
}

export class MilestoneNotFoundError extends AppError {
  constructor() {
    super(404, ErrorCode.MILESTONE_NOT_FOUND, 'Milestone not found')
  }
}

export class PlanNotOwnedError extends AppError {
  constructor() {
    super(403, ErrorCode.PLAN_NOT_OWNED, 'This plan does not belong to you')
  }
}

export class PlanDocumentNotFoundError extends AppError {
  constructor() {
    super(
      404,
      ErrorCode.PLAN_DOCUMENT_NOT_FOUND,
      'This plan has no document uploaded'
    )
  }
}
