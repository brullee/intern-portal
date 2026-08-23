import { Router } from 'express'
import universityController from '../controllers/universityController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.get('/', requireAuth, universityController.list)
router.get('/:id', requireAuth, universityController.getOne)
router.post(
  '/',
  requireAuth,
  requirePermission('manage_users'),
  universityController.create
)
router.put(
  '/:id',
  requireAuth,
  requirePermission('manage_users'),
  universityController.update
)
router.delete(
  '/:id',
  requireAuth,
  requirePermission('manage_users'),
  universityController.remove
)

export default router
