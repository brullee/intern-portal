import { Router } from 'express'
import planController from '../controllers/planController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'
import { uploadPlanDocument } from '../middleware/upload'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin', 'mentor'), planController.list)
router.get(
  '/progress-report',
  requireRole('admin', 'mentor'),
  planController.progressReport
)
router.get('/:id', requireRole('admin', 'mentor'), planController.getOne)
router.post('/', requirePermission('manage_plans'), planController.create)
router.patch('/:id', requirePermission('manage_plans'), planController.update)
router.delete('/:id', requirePermission('manage_plans'), planController.remove)

router.get(
  '/:id/document',
  requireRole('admin', 'mentor'),
  planController.getDocument
)
router.post(
  '/:id/document',
  requirePermission('manage_plans'),
  uploadPlanDocument,
  planController.uploadDocument
)
router.delete(
  '/:id/document',
  requirePermission('manage_plans'),
  planController.removeDocument
)

router.get(
  '/:id/milestones',
  requireRole('admin', 'mentor'),
  planController.listMilestones
)
router.post(
  '/:id/milestones',
  requirePermission('manage_plans'),
  planController.createMilestone
)
router.patch(
  '/:id/milestones/:milestoneId',
  requirePermission('manage_plans'),
  planController.updateMilestone
)
router.delete(
  '/:id/milestones/:milestoneId',
  requirePermission('manage_plans'),
  planController.removeMilestone
)

export default router
