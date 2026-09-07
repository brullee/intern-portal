import db from '../../db';
import { PaginationParams } from '../utils/pagination';

export const findTodayRecord = async (userId: string, dateStr: string) => {
  return db('attendance').where({ user_id: userId, date: dateStr }).first();
};

export const recordActivity = async (userId: string, dateStr: string, now: Date) => {
  const existing = await findTodayRecord(userId, dateStr);

  if (!existing) {
    return db('attendance').insert({
      user_id: userId,
      date: dateStr,
      first_seen_at: now,
      last_active_at: now,
      active_minutes: 1,
      status: 'PENDING',
    });
  }

  const lastActive = new Date(existing.last_active_at).getTime();
  const diffInSeconds = Math.floor((now.getTime() - lastActive) / 1000);

  if (diffInSeconds > 3600) {
    return db('attendance')
      .where({ id: existing.id })
      .update({
        status: 'ABSENT',
        absence_reason: 'Exceeded 60 minutes of inactivity between 9:30 AM and 1:00 PM',
      });
  }

  const minutesToAdd = diffInSeconds >= 60 ? Math.floor(diffInSeconds / 60) : 0;

  return db('attendance')
    .where({ id: existing.id })
    .update({
      last_active_at: now,
      active_minutes: db.raw('active_minutes + ?', [minutesToAdd]),
    });
};

export const listAttendanceSessions = async (
  pagination: PaginationParams,
  filters: { internId?: number } = {}
) => {
  const query = db('attendance');

  if (filters.internId) {
    query.where('user_id', filters.internId);
  }


  const [{ count }] = await query.clone().count('* as count');
  const total = Number(count);


  const rows = await query
    .select('*')
    .limit(pagination.limit)
    .offset(pagination.offset)
    .orderBy('date', 'desc');

  return { rows, total };
};