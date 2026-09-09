import type { Request, Response, NextFunction } from 'express'
import authService from '../services/authService'
import { NotAuthenticatedError } from '../errors/AppError'

function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.access_token
  if (!token) throw new NotAuthenticatedError()

  try {
    const payload = authService.verifyAccessToken(token)
    req.user = {
      id: payload.sub,
      username: payload.username,
      roleId: payload.roleId,
      roleName: payload.roleName,
    }
  } catch {
    throw new NotAuthenticatedError('Invalid or expired session')
  }
  next()
}

export { requireAuth }
