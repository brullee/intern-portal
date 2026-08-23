import knex from '../../db'

export interface Task {
  id: number
  project_id: number | null
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  status: 'not_started' | 'in_progress' | 'submitted' | 'approved' | 'rejected'
  created_by: number | null
  created_at: Date
  updated_at: Date
}

export interface NewTask {
  project_id?: number
  title: string
  description?: string
  priority?: Task['priority']
  due_date?: string
  status?: Task['status']
  created_by?: number
}

function findAll(): Promise<Task[]> {
  return knex<Task>('tasks').orderBy('created_at', 'desc')
}

function findById(id: number): Promise<Task | undefined> {
  return knex<Task>('tasks').where({ id }).first()
}

async function create(data: NewTask): Promise<Task> {
  const [task] = await knex<Task>('tasks').insert(data).returning('*')
  return task
}

async function update(
  id: number,
  data: Partial<NewTask>
): Promise<Task | undefined> {
  const [task] = await knex<Task>('tasks')
    .where({ id })
    .update({ ...data, updated_at: knex.fn.now() })
    .returning('*')
  return task
}

function remove(id: number): Promise<number> {
  return knex<Task>('tasks').where({ id }).del()
}

export default { findAll, findById, create, update, remove }
