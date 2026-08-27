import type { Knex } from 'knex'
import knex from '../../db'
import type { Task } from './tasks'
import type { PaginationParams } from '../utils/pagination'

export class DuplicateAssignmentError extends Error {}
export class InvalidReferenceError extends Error {}

export interface TaskAssignment {
  task_id: number
  intern_id: number
  assigned_at: Date
}

function findByTask(taskId: number): Promise<TaskAssignment[]> {
  return knex<TaskAssignment>('task_assignments').where({ task_id: taskId })
}

function findByIntern(internId: number): Promise<TaskAssignment[]> {
  return knex<TaskAssignment>('task_assignments').where({
    intern_id: internId,
  })
}

function find(
  taskId: number,
  internId: number
): Promise<TaskAssignment | undefined> {
  return knex<TaskAssignment>('task_assignments')
    .where({ task_id: taskId, intern_id: internId })
    .first()
}

async function listTasksForIntern(
  internId: number,
  pagination: PaginationParams
): Promise<{ rows: Task[]; total: number }> {
  const base = knex('task_assignments')
    .join('tasks', 'tasks.id', 'task_assignments.task_id')
    .where('task_assignments.intern_id', internId)

  const countQuery = base.clone()
  const rows = await base
    .select('tasks.*')
    .orderBy('tasks.created_at', 'desc')
    .limit(pagination.limit)
    .offset(pagination.offset)
  const [{ count }] = await countQuery.count<{ count: string }[]>('* as count')
  return { rows: rows as Task[], total: Number(count) }
}

async function assign(
  taskId: number,
  internId: number
): Promise<TaskAssignment> {
  try {
    const [row] = await knex<TaskAssignment>('task_assignments')
      .insert({ task_id: taskId, intern_id: internId })
      .returning('*')
    return row
  } catch (err) {
    if (err instanceof Error && 'code' in err) {
      if (err.code === '23505') throw new DuplicateAssignmentError()
      if (err.code === '23503') throw new InvalidReferenceError()
    }
    throw err
  }
}

function unassign(
  taskId: number,
  internId: number,
  trx: Knex = knex
): Promise<number> {
  return trx('task_assignments')
    .where({ task_id: taskId, intern_id: internId })
    .del()
}

// Used when an intern is removed from a project — a task assignment implies
// project membership, so this cascade keeps that invariant when membership
// is revoked.
async function removeByProjectAndIntern(
  projectId: number,
  internId: number,
  trx: Knex = knex
): Promise<number> {
  const taskIds = await trx('tasks')
    .where({ project_id: projectId })
    .pluck('id')
  if (taskIds.length === 0) return 0
  return trx('task_assignments')
    .where({ intern_id: internId })
    .whereIn('task_id', taskIds)
    .del()
}

export default {
  findByTask,
  findByIntern,
  find,
  listTasksForIntern,
  assign,
  unassign,
  removeByProjectAndIntern,
}
