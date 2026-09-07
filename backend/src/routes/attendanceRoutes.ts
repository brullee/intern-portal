import { Router } from 'express'
import { sendHeartbeat } from '../controllers/attendanceController' 
import {requireAuth} from '../middleware/authMiddleware';
const router = Router()

router.post("/HeartBeatAttendence" ,requireAuth, sendHeartbeat);

export default router
