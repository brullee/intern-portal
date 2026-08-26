import knex from '../../db'

export interface University {
  id: number
  name: string
  country: string | null
  is_active: boolean
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

function setActive(id: number, isActive: boolean): Promise<number> {
  return knex<University>('universities')
    .where({ id })
    .update({ is_active: isActive, updated_at: knex.fn.now() })
}

export default { findAll, findById, create, update, setActive }
