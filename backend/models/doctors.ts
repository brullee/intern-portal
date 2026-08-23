import knex from '../db'

export class DuplicateUsernameError extends Error {}

export interface DoctorWithUser {
  user_id: number
  university_id: number
  department: string | null
  title: string | null
  full_name: string
  username: string
  email: string | null
  is_active: boolean
}

const DOCTOR_COLUMNS = [
  'doctors.user_id',
  'doctors.university_id',
  'doctors.department',
  'doctors.title',
  'users.full_name',
  'users.username',
  'users.email',
  'users.is_active',
]

function findAll(): Promise<DoctorWithUser[]> {
  return knex('doctors')
    .join('users', 'users.id', 'doctors.user_id')
    .select(DOCTOR_COLUMNS)
    .orderBy('users.full_name')
}

function findById(userId: number): Promise<DoctorWithUser | undefined> {
  return knex('doctors')
    .join('users', 'users.id', 'doctors.user_id')
    .where('doctors.user_id', userId)
    .select(DOCTOR_COLUMNS)
    .first()
}

export interface NewDoctor {
  full_name: string
  username: string
  password_hash: string
  role_id: number
  university_id: number
  department?: string
  title?: string
}

async function create(data: NewDoctor): Promise<DoctorWithUser> {
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

      await trx('doctors').insert({
        user_id: user.id,
        university_id: data.university_id,
        department: data.department,
        title: data.title,
      })

      return {
        user_id: user.id,
        university_id: data.university_id,
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

interface DoctorUpdate {
  university_id?: number
  department?: string
  title?: string
}

function update(userId: number, data: DoctorUpdate): Promise<number> {
  return knex('doctors').where({ user_id: userId }).update(data)
}

function remove(userId: number): Promise<number> {
  // doctors.user_id -> users.id is ON DELETE CASCADE, so deleting the user
  // row removes the doctors row too.
  return knex('users').where({ id: userId }).del()
}

export default { findAll, findById, create, update, remove }
