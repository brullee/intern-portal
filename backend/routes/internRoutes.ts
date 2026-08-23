import { Router } from 'express'
import internController from '../controllers/internController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.get('/', requireAuth, internController.list)
router.get('/:userId', requireAuth, internController.getOne)
router.post(
  '/',
  requireAuth,
  requirePermission('manage_users'),
  internController.create
)
router.put(
  '/:userId',
  requireAuth,
  requirePermission('manage_users'),
  internController.update
)
router.delete(
  '/:userId',
  requireAuth,
  requirePermission('manage_users'),
  internController.remove
)

export default router
