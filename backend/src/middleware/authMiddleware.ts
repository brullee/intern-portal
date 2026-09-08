import type { Request, Response, NextFunction } from 'express'
import authService from '../services/authService'

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.access_token
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  try {
    const payload = authService.verifyAccessToken(token)
    req.user = {
      id: payload.sub,
      username: payload.username,
      roleId: payload.roleId,
      roleName: payload.roleName,
    }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' })
  }
}


export { requireAuth }
