import { Router } from 'express'
import meController from '../controllers/meController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'

// The intern's own portal: every route is scoped to the authenticated
// intern's user id.
const router = Router()

router.use(requireAuth)
router.use(requireRole('intern'))

router.get('/', meController.getProfile)
router.get('/projects', meController.listProjects)
router.get('/tasks', meController.listTasks)
router.get('/submissions', meController.listSubmissions)
router.get('/plans', meController.listPlans)
router.patch(
  '/plans/:planId/milestones/:milestoneId',
  meController.updateMilestoneStatus
)

export default router
