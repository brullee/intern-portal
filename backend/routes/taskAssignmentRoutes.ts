import { Router } from 'express'
import taskAssignmentController from '../controllers/taskAssignmentController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.get('/', requireAuth, taskAssignmentController.list)
router.post(
  '/',
  requireAuth,
  requirePermission('manage_tasks'),
  taskAssignmentController.assign
)
router.delete(
  '/:taskId/:internId',
  requireAuth,
  requirePermission('manage_tasks'),
  taskAssignmentController.unassign
)

export default router
