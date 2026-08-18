import knex from '../db'

export interface User {
  id: number
  full_name: string
  username: string
  email: string | null
  password_hash: string
  role_id: number
  phone: string | null
  avatar_url: string | null
  is_active: boolean
  created_by: number | null
  created_at: Date
  updated_at: Date
}

export interface NewUser {
  full_name: string
  username: string
  password_hash: string
  role_id: number
  email?: string
  phone?: string
  created_by?: number
}

function findByUsername(username: string): Promise<User | undefined> {
  return knex<User>('users').where({ username }).first()
}

function findById(id: number): Promise<User | undefined> {
  return knex<User>('users').where({ id }).first()
}

async function createUser(data: NewUser): Promise<User> {
  const [user] = await knex<User>('users').insert(data).returning('*')
  return user
}

function updateUsername(id: number, username: string): Promise<number> {
  return knex<User>('users')
    .where({ id })
    .update({ username, updated_at: knex.fn.now() })
}

function updatePasswordHash(
  id: number,
  password_hash: string
): Promise<number> {
  return knex<User>('users')
    .where({ id })
    .update({ password_hash, updated_at: knex.fn.now() })
}

export default {
  findByUsername,
  findById,
  createUser,
  updateUsername,
  updatePasswordHash,
}
