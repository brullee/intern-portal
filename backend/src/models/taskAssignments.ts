import knex from '../../db'

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

function unassign(taskId: number, internId: number): Promise<number> {
  return knex('task_assignments')
    .where({ task_id: taskId, intern_id: internId })
    .del()
}

export default { findByTask, findByIntern, assign, unassign }
