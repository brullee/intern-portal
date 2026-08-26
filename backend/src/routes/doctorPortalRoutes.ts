import { Router } from 'express'
import * as doctorScopeController from '../controllers/doctorScopeController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'

// Strictly read-only: doctors have no write endpoints anywhere in this
// router, and requireRole("doctor") plus per-lookup scope checks in
// doctorScopeService keep this to the doctor's own university's student
// interns only.
const router = Router()

router.use(requireAuth)
router.use(requireRole('doctor'))

router.get('/interns', doctorScopeController.listInterns)
router.get('/interns/:id', doctorScopeController.getInternProfile)
router.get('/interns/:id/tasks', doctorScopeController.listInternTasks)
router.get('/interns/:id/plans', doctorScopeController.listInternPlans)
router.get(
  '/interns/:id/attendance',
  doctorScopeController.listInternAttendance
)

export default router
