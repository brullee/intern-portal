import type { Request, Response } from 'express'
import universityService from '../services/universityService'
import { parsePagination } from '../utils/pagination'
import type {
  CreateUniversityBody,
  UpdateUniversityBody,
  ListUniversitiesQuery,
} from '../schemas/universitySchemas'

async function list(req: Request, res: Response): Promise<void> {
  const pagination = parsePagination(req)
  const { includeInactive } = req.validatedQuery as ListUniversitiesQuery
  const result = await universityService.listUniversities(pagination, {
    includeInactive,
  })
  res.json(result)
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
  const body = req.body as CreateUniversityBody
  const university = await universityService.createUniversity(body)
  res.status(201).json({ university })
}

async function update(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const body = req.body as UpdateUniversityBody
  const university = await universityService.updateUniversity(id, body)
  if (!university) {
    res.status(404).json({ error: 'University not found' })
    return
  }
  res.json({ university })
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
