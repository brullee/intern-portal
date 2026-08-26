import type { Request, Response } from 'express'
import universityService, { ValidationError } from '../services/universityService'

async function list(req: Request, res: Response): Promise<void> {
  const universities = await universityService.listUniversities()
  res.json({ universities })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const university = await universityService.getUniversity(id)
  if (!university) {
    res.status(404).json({ error: 'University not found' })
    return
  }
  res.json({ university })
}

async function create(req: Request, res: Response): Promise<void> {
  try {
    const university = await universityService.createUniversity(
      req.body ?? {}
    )
    res.status(201).json({ university })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function update(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  try {
    const university = await universityService.updateUniversity(
      id,
      req.body ?? {}
    )
    if (!university) {
      res.status(404).json({ error: 'University not found' })
      return
    }
    res.json({ university })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function deactivate(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const deactivated = await universityService.deactivateUniversity(id)
  if (!deactivated) {
    res.status(404).json({ error: 'University not found' })
    return
  }
  res.status(204).send()
}

export default { list, getOne, create, update, deactivate }
