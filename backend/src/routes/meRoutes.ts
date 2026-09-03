import { Router } from 'express'
import meController from '../controllers/meController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'

// The intern's own portal: every route is scoped to the authenticated
// intern's user id, so there are no path params and no write endpoints.
const router = Router()

router.use(requireAuth)
router.use(requireRole('intern'))

router.get('/', meController.getProfile)
router.get('/projects', meController.listProjects)
router.get('/tasks', meController.listTasks)
router.get('/submissions', meController.listSubmissions)
router.get('/plans', meController.listPlans)

export default router
