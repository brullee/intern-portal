import { Router } from 'express'
import universityController from '../controllers/universityController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'
import { validate } from '../middleware/validate'
import {
  universityIdParamSchema,
  createUniversitySchema,
  updateUniversitySchema,
  listUniversitiesQuerySchema,
} from '../schemas/universitySchemas'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requireRole('admin', 'mentor'),
  validate({ query: listUniversitiesQuerySchema }),
  universityController.list
)
router.get(
  '/:id',
  requireRole('admin', 'mentor'),
  validate({ params: universityIdParamSchema }),
  universityController.getOne
)
router.post(
  '/',
  requirePermission('manage_universities'),
  validate({ body: createUniversitySchema }),
  universityController.create
)
router.patch(
  '/:id',
  requirePermission('manage_universities'),
  validate({ body: updateUniversitySchema }),
  universityController.update
)
router.patch(
  '/:id/deactivate',
  requirePermission('manage_universities'),
  validate({ params: universityIdParamSchema }),
  universityController.deactivate
)

export default router
