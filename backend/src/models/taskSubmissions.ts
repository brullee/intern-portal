import type { Knex } from 'knex'
import knex from '../../db'

export interface TaskSubmission {
  id: number
  task_id: number
  intern_id: number
  note: string | null
  file_url: string | null
  submitted_at: Date
  reviewed_by: number | null
  review_status: 'pending' | 'approved' | 'rejected'
  review_comment: string | null
  reviewed_at: Date | null
}

export interface NewTaskSubmission {
  task_id: number
  intern_id: number
  note?: string
  file_url?: string | null

}

function findByTask(taskId: number): Promise<TaskSubmission[]> {
  return knex<TaskSubmission>('task_submissions')
    .where({ task_id: taskId })
    .orderBy('submitted_at', 'desc')
}

function findById(id: number): Promise<TaskSubmission | undefined> {
  return knex<TaskSubmission>('task_submissions').where({ id }).first()
}

async function create(
  data: NewTaskSubmission,
  trx: Knex = knex
): Promise<TaskSubmission> {
  const [row] = await trx<TaskSubmission>('task_submissions')
    .insert(data)
    .returning('*')
  return row
}

interface ReviewUpdate {
  review_status: 'approved' | 'rejected'
  review_comment?: string
  reviewed_by: number
}

async function review(
  id: number,
  data: ReviewUpdate,
  trx: Knex = knex
): Promise<TaskSubmission | undefined> {
  const [row] = await trx<TaskSubmission>('task_submissions')
    .where({ id })
    .update({ ...data, reviewed_at: trx.fn.now() })
    .returning('*')
  return row
}

export default { findByTask, findById, create, review }
