import { Router } from 'express'
import internController from '../controllers/internController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', internController.list)
router.get('/:userId', internController.getOne)
router.post('/', requirePermission('manage_users'), internController.create)
router.patch(
  '/:userId',
  requirePermission('manage_users'),
  internController.update
)
router.patch(
  '/:userId/deactivate',
  requirePermission('manage_users'),
  internController.deactivate
)

export default router
