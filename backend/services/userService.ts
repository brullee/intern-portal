import bcrypt from 'bcrypt'
import usersModel, { type User } from '../models/users'

const SALT_ROUNDS = 10

export type SafeUser = Omit<User, 'password_hash'>

function toSafeUser(user: User): SafeUser {
  const { password_hash: _password_hash, ...safeUser } = user
  return safeUser
}

export interface CreateUserInput {
  full_name: string
  username: string
  password: string
  role_id: number
  email?: string
  phone?: string
  created_by?: number
}

// Admin-only: creates a new user account (admin, mentor, doctor, or intern).
async function createUser(input: CreateUserInput): Promise<SafeUser> {
  const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS)
  const user = await usersModel.createUser({
    full_name: input.full_name,
    username: input.username,
    password_hash,
    role_id: input.role_id,
    email: input.email,
    phone: input.phone,
    created_by: input.created_by,
  })
  return toSafeUser(user)
}

// Used by the login endpoint — returns the user if the password matches, null otherwise.
async function verifyCredentials(
  username: string,
  password: string
): Promise<SafeUser | null> {
  const user = await usersModel.findByUsername(username)
  if (!user || !user.is_active) return null

  const passwordMatches = await bcrypt.compare(password, user.password_hash)
  if (!passwordMatches) return null

  return toSafeUser(user)
}

async function findById(id: number): Promise<SafeUser | null> {
  const user = await usersModel.findById(id)
  return user ? toSafeUser(user) : null
}

// Admin-only: changes a user's username. Does not touch the password.
async function updateUsername(id: number, username: string): Promise<void> {
  await usersModel.updateUsername(id, username)
}

// Admin-only: changes a user's password. There is no self-service password change.
async function updatePassword(id: number, newPassword: string): Promise<void> {
  const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS)
  await usersModel.updatePasswordHash(id, password_hash)
}

export default {
  createUser,
  verifyCredentials,
  findById,
  updateUsername,
  updatePassword,
}
