import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors/AppError'
import { ErrorCode } from '../errors/errorCodes'

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
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      code: ErrorCode.VALIDATION_ERROR,
      details: err.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    })
  }
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
