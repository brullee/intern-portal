// controllers/attendanceController.ts
import { Request, Response, NextFunction } from 'express';
import { findTodayRecord , recordActivity , listAttendanceSessions} from '../models/attendanceSessions';
import { UserWithRole } from '../models/users';
export const sendHeartbeat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as unknown as UserWithRole).id;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const startWindow = 9 * 60 + 30; 
    const endWindow = 17 * 60;        
    
    
    if (currentTimeInMinutes < startWindow || currentTimeInMinutes > endWindow) {
      return res.status(200).json({ message: 'خارج نطاق فترة التقييم (9:30 - 5:00)' });
    }

    
    await recordActivity(String(userId), todayStr, now);

    return res.status(200).json({ status: 'ok', timestamp: now });
  } catch (error) {
    next(error);
  }
};
