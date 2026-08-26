import { Router } from 'express'
import universityController from '../controllers/universityController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin', 'mentor'), universityController.list)
router.get('/:id', requireRole('admin', 'mentor'), universityController.getOne)
router.post(
  '/',
  requirePermission('manage_universities'),
  universityController.create
)
router.patch(
  '/:id',
  requirePermission('manage_universities'),
  universityController.update
)
router.patch(
  '/:id/deactivate',
  requirePermission('manage_universities'),
  universityController.deactivate
)

export default router
