import { Router } from 'express'
import projectInternController from '../controllers/projectInternController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.get('/', requireAuth, projectInternController.list)
router.post(
  '/',
  requireAuth,
  requirePermission('manage_projects'),
  projectInternController.assign
)
router.delete(
  '/:projectId/:internId',
  requireAuth,
  requirePermission('manage_projects'),
  projectInternController.unassign
)

export default router
