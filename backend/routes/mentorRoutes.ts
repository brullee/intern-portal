import { Router } from 'express'
import mentorController from '../controllers/mentorController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.get('/', requireAuth, mentorController.list)
router.get('/:userId', requireAuth, mentorController.getOne)
router.post(
  '/',
  requireAuth,
  requirePermission('manage_users'),
  mentorController.create
)
router.put(
  '/:userId',
  requireAuth,
  requirePermission('manage_users'),
  mentorController.update
)
router.delete(
  '/:userId',
  requireAuth,
  requirePermission('manage_users'),
  mentorController.remove
)

export default router
