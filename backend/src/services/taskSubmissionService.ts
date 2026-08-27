import knex from '../../db'
import taskSubmissionsModel, {
  type TaskSubmission,
} from '../models/taskSubmissions'
import tasksModel from '../models/tasks'
import taskAssignmentsModel from '../models/taskAssignments'
import activityLogsModel from '../models/activityLogs'
import { ValidationError } from '../errors/AppError'
import { TaskNotFoundError } from './taskService'
import {
  TaskNotAssignedError,
  SubmissionNotAllowedError,
} from '../errors/submissionErrors'

export { ValidationError, TaskNotFoundError, TaskNotAssignedError }
export { SubmissionNotAllowedError }
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

async function createSubmission(
  input: SubmissionInput,
  internId: number
): Promise<TaskSubmission> {
  assertValid(input)

  const task = await tasksModel.findById(input.task_id)
  if (!task) throw new TaskNotFoundError()

  const assignment = await taskAssignmentsModel.find(input.task_id, internId)
  if (!assignment) throw new TaskNotAssignedError()

  const priorSubmissions = await taskSubmissionsModel.findByTask(
    input.task_id
  )
  const latest = priorSubmissions.find((s) => s.intern_id === internId)
  if (
    latest &&
    (latest.review_status === 'pending' || latest.review_status === 'approved')
  ) {
    throw new SubmissionNotAllowedError()
  }

  return knex.transaction(async (trx) => {
    const submission = await taskSubmissionsModel.create(
      {
        task_id: input.task_id,
        intern_id: internId,
        note: input.note?.trim(),
        file_url: input.file_url?.trim(),
      },
      trx
    )

    await tasksModel.update(input.task_id, { status: 'submitted' }, trx)

    return submission
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

  return knex.transaction(async (trx) => {
    const updated = await taskSubmissionsModel.review(
      id,
      {
        review_status: status,
        review_comment: comment?.trim(),
        reviewed_by: reviewedBy,
      },
      trx
    )

    await tasksModel.update(submission.task_id, { status }, trx)

    await activityLogsModel.create(
      {
        intern_id: submission.intern_id,
        actor_id: reviewedBy,
        action_type: `task_submission_${status}`,
        entity_type: 'task_submissions',
        entity_id: id,
      },
      trx
    )

    return updated
  })
}

export default {
  listByTask,
  getSubmission,
  createSubmission,
  reviewSubmission,
}
