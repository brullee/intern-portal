import type { Request, Response } from 'express'
import { NotFoundError } from '../errors/AppError'
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
    throw new NotFoundError('Intern not found')
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
      throw new NotFoundError('Intern not found')
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

async function deactivate(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const deactivated = await internService.deactivateIntern(userId)
  if (!deactivated) {
    throw new NotFoundError('Intern not found')
  }
  res.status(204).send()
}

async function updateAssignment(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  try {
    const intern = await internService.updateAssignment(
      userId,
      req.body ?? {}
    )
    if (!intern) {
      throw new NotFoundError('Intern not found')
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

export default { list, getOne, create, update, deactivate, updateAssignment }
