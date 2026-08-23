import { Router } from 'express'
import planController from '../controllers/planController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.get('/', requireAuth, planController.list)
router.get('/:id', requireAuth, planController.getOne)
router.post(
  '/',
  requireAuth,
  requirePermission('manage_plans'),
  planController.create
)
router.put(
  '/:id',
  requireAuth,
  requirePermission('manage_plans'),
  planController.update
)
router.delete(
  '/:id',
  requireAuth,
  requirePermission('manage_plans'),
  planController.remove
)

export default router
