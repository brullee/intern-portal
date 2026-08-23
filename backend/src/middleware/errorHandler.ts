import type { Request, Response, NextFunction } from 'express'

// Registered last, after every route. Express 5 auto-forwards a rejected
// promise from any async handler here — no per-route try/catch needed for
// errors this app doesn't already handle explicitly (e.g. a raw FK violation
// nothing upstream expected).
function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}

export { errorHandler }
