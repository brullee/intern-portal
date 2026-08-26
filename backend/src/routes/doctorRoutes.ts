import { Router } from 'express'
import doctorController from '../controllers/doctorController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'

const router = Router()

router.use(requireAuth)
router.use(requireRole('doctor'))

router.get('/', doctorController.list)
router.get('/:userId', doctorController.getOne)
router.post('/', doctorController.create)
router.patch('/:userId', doctorController.update)
router.patch('/:userId/deactivate', doctorController.deactivate)

export default router
