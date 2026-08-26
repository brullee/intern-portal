import { Router } from 'express'
import universityController from '../controllers/universityController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', universityController.list)
router.get('/:id', universityController.getOne)
router.post('/', requirePermission('manage_users'), universityController.create)
router.patch(
  '/:id',
  requirePermission('manage_users'),
  universityController.update
)
router.patch(
  '/:id/deactivate',
  requirePermission('manage_users'),
  universityController.deactivate
)

export default router
