import { Router } from 'express'
import doctorController from '../controllers/doctorController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.get('/', requireAuth, doctorController.list)
router.get('/:userId', requireAuth, doctorController.getOne)
router.post(
  '/',
  requireAuth,
  requirePermission('manage_users'),
  doctorController.create
)
router.put(
  '/:userId',
  requireAuth,
  requirePermission('manage_users'),
  doctorController.update
)
router.delete(
  '/:userId',
  requireAuth,
  requirePermission('manage_users'),
  doctorController.remove
)

export default router
