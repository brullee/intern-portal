import { Router } from 'express'
import mentorController from '../controllers/mentorController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin', 'mentor'), mentorController.list)
router.get('/:userId', requireRole('admin', 'mentor'), mentorController.getOne)
router.post('/', requirePermission('manage_users'), mentorController.create)
router.patch(
  '/:userId',
  requirePermission('manage_users'),
  mentorController.update
)
router.patch(
  '/:userId/deactivate',
  requirePermission('manage_users'),
  mentorController.deactivate
)

export default router
