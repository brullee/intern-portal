import knex from '../db'

export class DuplicateAssignmentError extends Error {}
export class InvalidReferenceError extends Error {}

export interface ProjectIntern {
  project_id: number
  intern_id: number
  assigned_at: Date
}

function findByProject(projectId: number): Promise<ProjectIntern[]> {
  return knex<ProjectIntern>('project_interns').where({
    project_id: projectId,
  })
}

function findByIntern(internId: number): Promise<ProjectIntern[]> {
  return knex<ProjectIntern>('project_interns').where({ intern_id: internId })
}

async function assign(
  projectId: number,
  internId: number
): Promise<ProjectIntern> {
  try {
    const [row] = await knex<ProjectIntern>('project_interns')
      .insert({ project_id: projectId, intern_id: internId })
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

function unassign(projectId: number, internId: number): Promise<number> {
  return knex('project_interns')
    .where({ project_id: projectId, intern_id: internId })
    .del()
}

export default { findByProject, findByIntern, assign, unassign }
