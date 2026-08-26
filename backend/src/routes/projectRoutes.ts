import { Router } from 'express'
import projectController from '../controllers/projectController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin', 'mentor'), projectController.list)
router.get('/:id', requireRole('admin', 'mentor'), projectController.getOne)
router.post('/', requirePermission('manage_projects'), projectController.create)
router.patch(
  '/:id',
  requirePermission('manage_projects'),
  projectController.update
)
router.delete(
  '/:id',
  requirePermission('manage_projects'),
  projectController.remove
)

router.get(
  '/:id/interns',
  requireRole('admin', 'mentor'),
  projectController.listInterns
)
router.post(
  '/:id/interns',
  requirePermission('assign_interns'),
  projectController.assignIntern
)
router.delete(
  '/:id/interns/:internId',
  requirePermission('assign_interns'),
  projectController.removeIntern
)

export default router
