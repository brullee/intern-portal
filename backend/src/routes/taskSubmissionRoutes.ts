import { Router } from 'express'
import taskSubmissionController from '../controllers/taskSubmissionController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', taskSubmissionController.listByTask)
router.get('/:id', taskSubmissionController.getOne)
router.post('/', taskSubmissionController.create)
router.patch(
  '/:id/review',
  requirePermission('approve_submissions'),
  taskSubmissionController.review
)

export default router
