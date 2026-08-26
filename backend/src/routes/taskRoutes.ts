import { Router } from 'express'
import taskController from '../controllers/taskController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin', 'mentor'), taskController.list)
router.get('/:id', requireRole('admin', 'mentor'), taskController.getOne)
router.post('/', requirePermission('manage_tasks'), taskController.create)
router.patch('/:id', requirePermission('manage_tasks'), taskController.update)
router.delete('/:id', requirePermission('manage_tasks'), taskController.remove)

router.get(
  '/:id/assignments',
  requireRole('admin', 'mentor'),
  taskController.listAssignments
)
router.post(
  '/:id/assignments',
  requirePermission('assign_interns'),
  taskController.assignIntern
)
router.delete(
  '/:id/assignments/:internId',
  requirePermission('assign_interns'),
  taskController.removeIntern
)

export default router
