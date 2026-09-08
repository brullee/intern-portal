import { listAttendanceSessions } from '../models/attendanceSessions';
import { PaginationParams, paginatedResponse } from '../utils/pagination';

export async function listSessions(
  pagination: PaginationParams,
  filters: { internId?: number } = {}
) {
  const { rows, total } = await listAttendanceSessions(
    pagination,
    filters
  );
  
  return paginatedResponse(rows, total, pagination);
}