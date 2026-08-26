import taskSubmissionsModel, {
  type TaskSubmission,
} from '../models/taskSubmissions'
import activityLogsModel from '../models/activityLogs'
import { ValidationError } from '../errors/AppError'

export { ValidationError }
export class InvalidReviewStateError extends Error {}

export interface SubmissionInput {
  task_id: number
  note?: string
  file_url?: string
}

function assertValid(input: SubmissionInput): void {
  if (!input.task_id) {
    throw new ValidationError('task_id is required')
  }
  if (!input.note?.trim() && !input.file_url?.trim()) {
    throw new ValidationError('note or file_url is required')
  }
}

function listByTask(taskId: number): Promise<TaskSubmission[]> {
  return taskSubmissionsModel.findByTask(taskId)
}

function getSubmission(id: number): Promise<TaskSubmission | undefined> {
  return taskSubmissionsModel.findById(id)
}

function createSubmission(
  input: SubmissionInput,
  internId: number
): Promise<TaskSubmission> {
  assertValid(input)
  return taskSubmissionsModel.create({
    task_id: input.task_id,
    intern_id: internId,
    note: input.note?.trim(),
    file_url: input.file_url?.trim(),
  })
}

async function reviewSubmission(
  id: number,
  status: 'approved' | 'rejected',
  comment: string | undefined,
  reviewedBy: number
): Promise<TaskSubmission | undefined> {
  const submission = await taskSubmissionsModel.findById(id)
  if (!submission) return undefined

  if (submission.review_status !== 'pending') {
    throw new InvalidReviewStateError('submission has already been reviewed')
  }

  const updated = await taskSubmissionsModel.review(id, {
    review_status: status,
    review_comment: comment?.trim(),
    reviewed_by: reviewedBy,
  })

  await activityLogsModel.create({
    intern_id: submission.intern_id,
    actor_id: reviewedBy,
    action_type: `task_submission_${status}`,
    entity_type: 'task_submissions',
    entity_id: id,
  })

  return updated
}

export default {
  listByTask,
  getSubmission,
  createSubmission,
  reviewSubmission,
}
