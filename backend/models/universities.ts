import knex from '../db'

export interface University {
  id: number
  name: string
  country: string | null
  created_at: Date
  updated_at: Date
}

export interface NewUniversity {
  name: string
  country?: string
}

function findAll(): Promise<University[]> {
  return knex<University>('universities').orderBy('name')
}

function findById(id: number): Promise<University | undefined> {
  return knex<University>('universities').where({ id }).first()
}

async function create(data: NewUniversity): Promise<University> {
  const [university] = await knex<University>('universities')
    .insert(data)
    .returning('*')
  return university
}

async function update(
  id: number,
  data: Partial<NewUniversity>
): Promise<University | undefined> {
  const [university] = await knex<University>('universities')
    .where({ id })
    .update({ ...data, updated_at: knex.fn.now() })
    .returning('*')
  return university
}

function remove(id: number): Promise<number> {
  return knex<University>('universities').where({ id }).del()
}

export default { findAll, findById, create, update, remove }
