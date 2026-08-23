import knex from '../db'

export class DuplicateUsernameError extends Error {}

export interface MentorWithUser {
  user_id: number
  department: string | null
  title: string | null
  full_name: string
  username: string
  email: string | null
  is_active: boolean
}

const MENTOR_COLUMNS = [
  'mentors.user_id',
  'mentors.department',
  'mentors.title',
  'users.full_name',
  'users.username',
  'users.email',
  'users.is_active',
]

function findAll(): Promise<MentorWithUser[]> {
  return knex('mentors')
    .join('users', 'users.id', 'mentors.user_id')
    .select(MENTOR_COLUMNS)
    .orderBy('users.full_name')
}

function findById(userId: number): Promise<MentorWithUser | undefined> {
  return knex('mentors')
    .join('users', 'users.id', 'mentors.user_id')
    .where('mentors.user_id', userId)
    .select(MENTOR_COLUMNS)
    .first()
}

export interface NewMentor {
  full_name: string
  username: string
  password_hash: string
  role_id: number
  department?: string
  title?: string
}

async function create(data: NewMentor): Promise<MentorWithUser> {
  try {
    return await knex.transaction(async (trx) => {
      const [user] = await trx('users')
        .insert({
          full_name: data.full_name,
          username: data.username,
          password_hash: data.password_hash,
          role_id: data.role_id,
        })
        .returning('*')

      await trx('mentors').insert({
        user_id: user.id,
        department: data.department,
        title: data.title,
      })

      return {
        user_id: user.id,
        department: data.department ?? null,
        title: data.title ?? null,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        is_active: user.is_active,
      }
    })
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === '23505') {
      throw new DuplicateUsernameError()
    }
    throw err
  }
}

interface MentorUpdate {
  department?: string
  title?: string
}

function update(userId: number, data: MentorUpdate): Promise<number> {
  return knex('mentors').where({ user_id: userId }).update(data)
}

function remove(userId: number): Promise<number> {
  // mentors.user_id -> users.id is ON DELETE CASCADE
  return knex('users').where({ id: userId }).del()
}

export default { findAll, findById, create, update, remove }
