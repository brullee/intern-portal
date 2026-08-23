import { Router } from 'express'
import projectController from '../controllers/projectController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.get('/', requireAuth, projectController.list)
router.get('/:id', requireAuth, projectController.getOne)
router.post(
  '/',
  requireAuth,
  requirePermission('manage_projects'),
  projectController.create
)
router.put(
  '/:id',
  requireAuth,
  requirePermission('manage_projects'),
  projectController.update
)
router.delete(
  '/:id',
  requireAuth,
  requirePermission('manage_projects'),
  projectController.remove
)

export default router
