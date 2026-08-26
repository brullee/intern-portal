import type { Request, Response } from 'express'
import doctorService, {
  ValidationError,
  DuplicateUsernameError,
} from '../services/doctorService'

async function list(req: Request, res: Response): Promise<void> {
  const doctors = await doctorService.listDoctors()
  res.json({ doctors })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const doctor = await doctorService.getDoctor(userId)
  if (!doctor) {
    res.status(404).json({ error: 'Doctor not found' })
    return
  }
  res.json({ doctor })
}

async function create(req: Request, res: Response): Promise<void> {
  try {
    const doctor = await doctorService.createDoctor(req.body ?? {})
    res.status(201).json({ doctor })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    if (err instanceof DuplicateUsernameError) {
      res.status(409).json({ error: 'Username is already taken' })
      return
    }
    throw err
  }
}

async function update(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const updatedCount = await doctorService.updateDoctor(
    userId,
    req.body ?? {}
  )
  if (updatedCount === 0) {
    res.status(404).json({ error: 'Doctor not found' })
    return
  }
  const doctor = await doctorService.getDoctor(userId)
  res.json({ doctor })
}

async function deactivate(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const deactivated = await doctorService.deactivateDoctor(userId)
  if (!deactivated) {
    res.status(404).json({ error: 'Doctor not found' })
    return
  }
  res.status(204).send()
}

export default { list, getOne, create, update, deactivate }
