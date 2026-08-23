import { Router } from 'express'
import taskController from '../controllers/taskController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.get('/', requireAuth, taskController.list)
router.get('/:id', requireAuth, taskController.getOne)
router.post(
  '/',
  requireAuth,
  requirePermission('manage_tasks'),
  taskController.create
)
router.put(
  '/:id',
  requireAuth,
  requirePermission('manage_tasks'),
  taskController.update
)
router.delete(
  '/:id',
  requireAuth,
  requirePermission('manage_tasks'),
  taskController.remove
)

export default router
