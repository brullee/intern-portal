import knex from '../../db'
import taskSubmissionsModel, {
  type TaskSubmission,
} from '../models/taskSubmissions'
import tasksModel from '../models/tasks'

import storageService from './storageService'

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
  files?: Express.Multer.File[] | null

}

function assertValid(input: SubmissionInput): void {
  if (!input.task_id) {
    throw new ValidationError('task_id is required')
  }

  if (!input.note?.trim() && (!input.files || input.files.length === 0)) {
    throw new ValidationError('note or file is required')
}
}

function listByTask(taskId: number): Promise<TaskSubmission[]> {
  return taskSubmissionsModel.findByTask(taskId)
}


async function getSubmission(id: number): Promise<TaskSubmission | undefined> {
  const submission = await taskSubmissionsModel.findById(id)
  if (!submission || !submission.file_url) return submission

 
  const fileKey = submission.file_url.split('/').pop() || submission.file_url


  const presignedUrl = await storageService.GetFilefromS3(fileKey)
  return { ...submission, file_url: presignedUrl }

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


 
  let uploadedUrls: string[] = []
  if (input.files && input.files.length > 0) {
    uploadedUrls = await storageService.uploadFiletoS3(input.files)
  }


  const fileUrlData = uploadedUrls.length > 0 ? uploadedUrls.join(',') : null



  return knex.transaction(async (trx) => {
    const submission = await taskSubmissionsModel.create(
      {
        task_id: input.task_id,
        intern_id: internId,
        note: input.note?.trim(),
        file_url: fileUrlData,

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

