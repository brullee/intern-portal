import { Request, Response, NextFunction } from 'express'
import { ErrorCode } from '../errors/errorCodes'

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: 'Not authenticated', code: ErrorCode.NOT_AUTHENTICATED })
    }

    if (!roles.includes(req.user.roleName)) {
      return res
        .status(403)
        .json({
          error: 'Insufficient permissions',
          code: ErrorCode.INSUFFICIENT_PERMISSIONS,
        })
    }

    next()
  }
}
