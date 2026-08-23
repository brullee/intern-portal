import knex from '../../db'

export interface Project {
  id: number
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  status: 'active' | 'on_hold' | 'completed' | 'cancelled'
  created_by: number | null
  created_at: Date
  updated_at: Date
}

export interface NewProject {
  name: string
  description?: string
  start_date?: string
  end_date?: string
  status?: 'active' | 'on_hold' | 'completed' | 'cancelled'
  created_by?: number
}

function findAll(): Promise<Project[]> {
  return knex<Project>('projects').orderBy('created_at', 'desc')
}

function findById(id: number): Promise<Project | undefined> {
  return knex<Project>('projects').where({ id }).first()
}

async function create(data: NewProject): Promise<Project> {
  const [project] = await knex<Project>('projects').insert(data).returning('*')
  return project
}

async function update(
  id: number,
  data: Partial<NewProject>
): Promise<Project | undefined> {
  const [project] = await knex<Project>('projects')
    .where({ id })
    .update({ ...data, updated_at: knex.fn.now() })
    .returning('*')
  return project
}

function remove(id: number): Promise<number> {
  return knex<Project>('projects').where({ id }).del()
}

export default { findAll, findById, create, update, remove }
