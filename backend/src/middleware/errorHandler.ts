import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError'

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ error: err.message, code: err.code })
  }
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
