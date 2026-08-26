import type { Request, Response } from 'express'
import authService, {
  InvalidCredentialsError,
  AccountInactiveError,
} from '../services/authService'
import * as permissionService from '../services/permissionService'
import {
  setAuthCookies,
  setAccessCookie,
  clearAuthCookies,
} from '../utils/cookies'
import type { UserWithRole } from '../models/users'

function toPublicUser(user: UserWithRole) {
  return {
    id: user.id,
    fullName: user.full_name,
    username: user.username,
    roleId: user.role_id,
    roleName: user.role_name,
  }
}

async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body ?? {}

  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Username and password are required' })
    return
  }

  try {
    const { accessToken, refreshToken, user } = await authService.login(
      username,
      password
    )
    setAuthCookies(res, accessToken, refreshToken)
    res.json({ user: toPublicUser(user) })
  } catch (err) {
    if (
      err instanceof InvalidCredentialsError ||
      err instanceof AccountInactiveError
    ) {
      res.status(401).json({ error: 'Invalid username or password' })
      return
    }
    throw err
  }
}

async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.refresh_token
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  try {
    const { accessToken, user } = await authService.refreshAccessToken(token)
    setAccessCookie(res, accessToken)
    res.json({ user: toPublicUser(user) })
  } catch {
    clearAuthCookies(res)
    res.status(401).json({ error: 'Session expired, please log in again' })
  }
}

function logout(_req: Request, res: Response): void {
  clearAuthCookies(res)
  res.status(204).send()
}

async function me(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  const permissions = await permissionService.resolveEffectivePermissions(
    req.user.id,
    req.user.roleId
  )
  res.json({ user: req.user, permissions })
}

export default { login, refresh, logout, me }
