import type { Request, Response } from 'express'
import mentorService, {
  ValidationError,
  DuplicateUsernameError,
} from '../services/mentorService'

async function list(req: Request, res: Response): Promise<void> {
  const mentors = await mentorService.listMentors()
  res.json({ mentors })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const mentor = await mentorService.getMentor(userId)
  if (!mentor) {
    res.status(404).json({ error: 'Mentor not found' })
    return
  }
  res.json({ mentor })
}

async function create(req: Request, res: Response): Promise<void> {
  try {
    const mentor = await mentorService.createMentor(req.body ?? {})
    res.status(201).json({ mentor })
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
  const updatedCount = await mentorService.updateMentor(
    userId,
    req.body ?? {}
  )
  if (updatedCount === 0) {
    res.status(404).json({ error: 'Mentor not found' })
    return
  }
  const mentor = await mentorService.getMentor(userId)
  res.json({ mentor })
}

async function remove(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const deleted = await mentorService.deleteMentor(userId)
  if (!deleted) {
    res.status(404).json({ error: 'Mentor not found' })
    return
  }
  res.status(204).send()
}

export default { list, getOne, create, update, remove }
