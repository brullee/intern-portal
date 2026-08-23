import knex from '../db'

export class DuplicateUsernameError extends Error {}

export interface InternWithUser {
  user_id: number
  university_id: number | null
  doctor_id: number | null
  student_id: string | null
  major: string | null
  intern_type: 'student' | 'graduate' | 'other'
  cohort: string | null
  start_date: string
  end_date: string | null
  status: 'applied' | 'active' | 'completed' | 'terminated' | 'on_leave'
  full_name: string
  username: string
  email: string | null
  is_active: boolean
}

const INTERN_COLUMNS = [
  'interns.user_id',
  'interns.university_id',
  'interns.doctor_id',
  'interns.student_id',
  'interns.major',
  'interns.intern_type',
  'interns.cohort',
  'interns.start_date',
  'interns.end_date',
  'interns.status',
  'users.full_name',
  'users.username',
  'users.email',
  'users.is_active',
]

function findAll(): Promise<InternWithUser[]> {
  return knex('interns')
    .join('users', 'users.id', 'interns.user_id')
    .select(INTERN_COLUMNS)
    .orderBy('users.full_name')
}

function findById(userId: number): Promise<InternWithUser | undefined> {
  return knex('interns')
    .join('users', 'users.id', 'interns.user_id')
    .where('interns.user_id', userId)
    .select(INTERN_COLUMNS)
    .first()
}

export interface NewIntern {
  full_name: string
  username: string
  password_hash: string
  role_id: number
  university_id?: number
  doctor_id?: number
  student_id?: string
  major?: string
  intern_type?: 'student' | 'graduate' | 'other'
  cohort?: string
  start_date: string
  end_date?: string
  status?: 'applied' | 'active' | 'completed' | 'terminated' | 'on_leave'
}

async function create(data: NewIntern): Promise<InternWithUser> {
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

      const [intern] = await trx('interns')
        .insert({
          user_id: user.id,
          university_id: data.university_id,
          doctor_id: data.doctor_id,
          student_id: data.student_id,
          major: data.major,
          intern_type: data.intern_type,
          cohort: data.cohort,
          start_date: data.start_date,
          end_date: data.end_date,
          status: data.status,
        })
        .returning('*')

      return {
        ...intern,
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

interface InternUpdate {
  university_id?: number | null
  doctor_id?: number | null
  student_id?: string
  major?: string
  intern_type?: 'student' | 'graduate' | 'other'
  cohort?: string
  start_date?: string
  end_date?: string
  status?: 'applied' | 'active' | 'completed' | 'terminated' | 'on_leave'
}

function update(userId: number, data: InternUpdate): Promise<number> {
  return knex('interns').where({ user_id: userId }).update(data)
}

function remove(userId: number): Promise<number> {
  // interns.user_id -> users.id is ON DELETE CASCADE
  return knex('users').where({ id: userId }).del()
}

export default { findAll, findById, create, update, remove }
