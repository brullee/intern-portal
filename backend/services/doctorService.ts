import bcrypt from 'bcrypt'
import knex from '../db'
import doctorsModel, {
  type DoctorWithUser,
  DuplicateUsernameError,
} from '../models/doctors'

export { DuplicateUsernameError }

const SALT_ROUNDS = 10

export class ValidationError extends Error {}

export interface DoctorInput {
  full_name: string
  username: string
  password: string
  university_id: number
  department?: string
  title?: string
}

function assertValid(input: DoctorInput): void {
  if (!input.full_name?.trim()) {
    throw new ValidationError('full_name is required')
  }
  if (!input.username?.trim()) {
    throw new ValidationError('username is required')
  }
  if (!input.password || input.password.length < 8) {
    throw new ValidationError('password must be at least 8 characters')
  }
  if (!input.university_id) {
    throw new ValidationError('university_id is required')
  }
}

async function getDoctorRoleId(): Promise<number> {
  const role = await knex('roles').where({ name: 'doctor' }).first()
  if (!role) throw new Error('doctor role not seeded')
  return role.id
}

function listDoctors(): Promise<DoctorWithUser[]> {
  return doctorsModel.findAll()
}

function getDoctor(userId: number): Promise<DoctorWithUser | undefined> {
  return doctorsModel.findById(userId)
}

async function createDoctor(input: DoctorInput): Promise<DoctorWithUser> {
  assertValid(input)
  const role_id = await getDoctorRoleId()
  const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS)

  return doctorsModel.create({
    full_name: input.full_name.trim(),
    username: input.username.trim(),
    password_hash,
    role_id,
    university_id: input.university_id,
    department: input.department?.trim(),
    title: input.title?.trim(),
  })
}

function updateDoctor(
  userId: number,
  input: Partial<Pick<DoctorInput, 'university_id' | 'department' | 'title'>>
): Promise<number> {
  return doctorsModel.update(userId, input)
}

async function deleteDoctor(userId: number): Promise<boolean> {
  const deletedCount = await doctorsModel.remove(userId)
  return deletedCount > 0
}

export default {
  listDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
}
