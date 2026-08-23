import { Router } from 'express'
import planMilestoneController from '../controllers/planMilestoneController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.get('/', requireAuth, planMilestoneController.list)
router.post(
  '/',
  requireAuth,
  requirePermission('manage_plans'),
  planMilestoneController.create
)
router.put(
  '/:id',
  requireAuth,
  requirePermission('manage_plans'),
  planMilestoneController.update
)
router.delete(
  '/:id',
  requireAuth,
  requirePermission('manage_plans'),
  planMilestoneController.remove
)

export default router
