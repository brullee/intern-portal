import type { Request, Response, NextFunction } from 'express'
import * as permissionService from '../services/permissionService'

function requirePermission(key: string) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const permissions = await permissionService.resolveEffectivePermissions(
      req.user.id,
      req.user.roleId
    )

    if (!permissions.includes(key)) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }

    next()
  }
}

export { requirePermission }
