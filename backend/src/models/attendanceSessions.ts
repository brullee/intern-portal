import knex from '../../db'
import type { PaginationParams } from '../utils/pagination'

// Read-side only for now — clock-in/clock-out and the 16h auto-close sweep
// are the Attendance feature itself (separate milestone). This exists so
// doctor-scope can list an intern's sessions.
export interface AttendanceSession {
  id: number
  intern_id: number
  clock_in: Date
  clock_out: Date | null
  auto_closed: boolean
  notes: string | null
  created_at: Date
}

async function list(
  pagination: PaginationParams,
  filters: { internId?: number } = {}
): Promise<{ rows: AttendanceSession[]; total: number }> {
  const base = knex<AttendanceSession>('attendance_sessions')
  if (filters.internId !== undefined) {
    base.where({ intern_id: filters.internId })
  }

  const countQuery = base.clone()
  const rows = await base
    .orderBy('clock_in', 'desc')
    .limit(pagination.limit)
    .offset(pagination.offset)
  const [{ count }] = await countQuery.count<{ count: string }[]>('* as count')
  return { rows, total: Number(count) }
}

export default { list }
