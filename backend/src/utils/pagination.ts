import { Request } from 'express'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export function parsePagination(req: Request): PaginationParams {
  const rawPage = Number(req.query.page)
  const rawLimit = Number(req.query.limit)

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1
  const limit =
    Number.isInteger(rawLimit) && rawLimit > 0
      ? Math.min(rawLimit, MAX_LIMIT)
      : DEFAULT_LIMIT

  return { page, limit, offset: (page - 1) * limit }
}

export interface PaginatedResult<T> {
  data: T[]
  page: number
  limit: number
  total: number
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  return { data, page: params.page, limit: params.limit, total }
}
