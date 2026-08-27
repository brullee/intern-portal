import { Request, Response, NextFunction } from 'express'
import { ZodType } from 'zod'

interface ValidationTargets {
  body?: ZodType
  params?: ZodType
  query?: ZodType
}

export function validate(targets: ValidationTargets) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (targets.body) req.body = targets.body.parse(req.body)
      if (targets.params)
        req.params = targets.params.parse(req.params) as typeof req.params
      if (targets.query)
        req.validatedQuery = targets.query.parse(req.query) as Record<
          string,
          unknown
        >
      next()
    } catch (err) {
      next(err)
    }
  }
}
