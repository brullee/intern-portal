import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import usersModel, { type UserWithRole } from '../models/users'
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../utils/config'

const ACCESS_TOKEN_TTL = '15m'
const REFRESH_TOKEN_TTL = '7d'

export class InvalidCredentialsError extends Error {}
export class AccountInactiveError extends Error {}
export class InvalidRefreshTokenError extends Error {}

export interface AccessTokenPayload {
  sub: number
  username: string
  roleId: number
  roleName: string
  type: 'access'
}

interface RefreshTokenPayload {
  sub: number
  type: 'refresh'
}

export interface AuthResult {
  accessToken: string
  refreshToken: string
  user: UserWithRole
}

function signAccessToken(user: UserWithRole): string {
  const payload: AccessTokenPayload = {
    sub: user.id,
    username: user.username,
    roleId: user.role_id,
    roleName: user.role_name,
    type: 'access',
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL })
}

function signRefreshToken(user: UserWithRole): string {
  const payload: RefreshTokenPayload = { sub: user.id, type: 'refresh' }
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL,
  })
}

async function login(
  username: string,
  password: string
): Promise<AuthResult> {
  const user = await usersModel.findByUsernameWithRole(username)
  if (!user) throw new InvalidCredentialsError()

  const passwordMatches = await bcrypt.compare(password, user.password_hash)
  if (!passwordMatches) throw new InvalidCredentialsError()

  if (!user.is_active) throw new AccountInactiveError()

  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
    user,
  }
}

async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; user: UserWithRole }> {
  let payload: RefreshTokenPayload
  try {
    payload = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET
    ) as unknown as RefreshTokenPayload
  } catch {
    throw new InvalidRefreshTokenError()
  }
  if (payload.type !== 'refresh') throw new InvalidRefreshTokenError()

  const user = await usersModel.findByIdWithRole(payload.sub)
  if (!user || !user.is_active) throw new InvalidRefreshTokenError()

  return { accessToken: signAccessToken(user), user }
}

function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(
    token,
    JWT_SECRET
  ) as unknown as AccessTokenPayload
  if (payload.type !== 'access') throw new Error('Invalid token type')
  return payload
}

export default {
  login,
  refreshAccessToken,
  verifyAccessToken,
}
