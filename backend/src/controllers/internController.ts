import type { Request, Response } from 'express'
import internService, {
  ValidationError,
  DuplicateUsernameError,
} from '../services/internService'

async function list(req: Request, res: Response): Promise<void> {
  const interns = await internService.listInterns()
  res.json({ interns })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const intern = await internService.getIntern(userId)
  if (!intern) {
    res.status(404).json({ error: 'Intern not found' })
    return
  }
  res.json({ intern })
}

async function create(req: Request, res: Response): Promise<void> {
  try {
    const intern = await internService.createIntern(req.body ?? {})
    res.status(201).json({ intern })
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
  try {
    const intern = await internService.updateIntern(userId, req.body ?? {})
    if (!intern) {
      res.status(404).json({ error: 'Intern not found' })
      return
    }
    res.json({ intern })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const deleted = await internService.deleteIntern(userId)
  if (!deleted) {
    res.status(404).json({ error: 'Intern not found' })
    return
  }
  res.status(204).send()
}

export default { list, getOne, create, update, remove }
