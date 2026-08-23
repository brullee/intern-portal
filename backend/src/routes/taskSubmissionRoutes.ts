import { Router } from 'express'
import taskSubmissionController from '../controllers/taskSubmissionController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.get('/', requireAuth, taskSubmissionController.listByTask)
router.get('/:id', requireAuth, taskSubmissionController.getOne)
router.post('/', requireAuth, taskSubmissionController.create)
router.put(
  '/:id/review',
  requireAuth,
  requirePermission('approve_tasks'),
  taskSubmissionController.review
)

export default router
