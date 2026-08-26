import bcrypt from 'bcrypt'
import knex from '../../db'
import mentorsModel, {
  type MentorWithUser,
  DuplicateUsernameError,
} from '../models/mentors'
import userService from './userService'

export { DuplicateUsernameError }

const SALT_ROUNDS = 10

export class ValidationError extends Error {}

export interface MentorInput {
  full_name: string
  username: string
  password: string
  department?: string
  title?: string
}

function assertValid(input: MentorInput): void {
  if (!input.full_name?.trim()) {
    throw new ValidationError('full_name is required')
  }
  if (!input.username?.trim()) {
    throw new ValidationError('username is required')
  }
  if (!input.password || input.password.length < 8) {
    throw new ValidationError('password must be at least 8 characters')
  }
}

async function getMentorRoleId(): Promise<number> {
  const role = await knex('roles').where({ name: 'mentor' }).first()
  if (!role) throw new Error('mentor role not seeded')
  return role.id
}

function listMentors(): Promise<MentorWithUser[]> {
  return mentorsModel.findAll()
}

function getMentor(userId: number): Promise<MentorWithUser | undefined> {
  return mentorsModel.findById(userId)
}

async function createMentor(input: MentorInput): Promise<MentorWithUser> {
  assertValid(input)
  const role_id = await getMentorRoleId()
  const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS)

  return mentorsModel.create({
    full_name: input.full_name.trim(),
    username: input.username.trim(),
    password_hash,
    role_id,
    department: input.department?.trim(),
    title: input.title?.trim(),
  })
}

function updateMentor(
  userId: number,
  input: Partial<Pick<MentorInput, 'department' | 'title'>>
): Promise<number> {
  return mentorsModel.update(userId, input)
}

function deactivateMentor(userId: number): Promise<boolean> {
  return userService.setActive(userId, false)
}

export default {
  listMentors,
  getMentor,
  createMentor,
  updateMentor,
  deactivateMentor,
}
