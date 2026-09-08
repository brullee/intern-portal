import type { Request, Response } from 'express'
import planService, { ValidationError } from '../services/planService'

async function list(req: Request, res: Response): Promise<void> {
  const internId = req.query.intern_id ? Number(req.query.intern_id) : undefined
  const plans = await planService.listPlans(internId)
  res.json({ plans })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const plan = await planService.getPlan(id)
  if (!plan) {
    res.status(404).json({ error: 'Plan not found' })
    return
  }
  res.json({ plan })
}

async function create(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  try {
    const plan = await planService.createPlan(req.body ?? {}, req.user.id)
    res.status(201).json({ plan })
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
    const plan = await planService.updatePlan(id, req.body ?? {})
    if (!plan) {
      res.status(404).json({ error: 'Plan not found' })
      return
    }
    res.json({ plan })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const deleted = await planService.deletePlan(id)
  if (!deleted) {
    res.status(404).json({ error: 'Plan not found' })
    return
  }
  res.status(204).send()
}

async function progressReport(_req: Request, res: Response): Promise<void> {
  const data = await planService.getProgressReport()
  res.json({ data })
}

async function getDocument(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const url = await planService.getPlanDocumentUrl(id)
  res.json({ url })
}

async function uploadDocument(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  if (!req.file) {
    res.status(400).json({ error: 'document file is required' })
    return
  }
  const plan = await planService.setPlanDocument(id, req.file)
  res.json({ plan })
}

async function removeDocument(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const plan = await planService.clearPlanDocument(id)
  res.json({ plan })
}

async function listMilestones(req: Request, res: Response): Promise<void> {
  const planId = Number(req.params.id)
  const milestones = await planService.listMilestones(planId)
  res.json({ milestones })
}

async function createMilestone(req: Request, res: Response): Promise<void> {
  const planId = Number(req.params.id)
  try {
    const milestone = await planService.createMilestone(planId, req.body ?? {})
    res.status(201).json({ milestone })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function updateMilestone(req: Request, res: Response): Promise<void> {
  const planId = Number(req.params.id)
  const milestoneId = Number(req.params.milestoneId)
  try {
    const milestone = await planService.updateMilestone(
      planId,
      milestoneId,
      req.body ?? {}
    )
    res.json({ milestone })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function removeMilestone(req: Request, res: Response): Promise<void> {
  const planId = Number(req.params.id)
  const milestoneId = Number(req.params.milestoneId)
  await planService.deleteMilestone(planId, milestoneId)
  res.status(204).send()
}

export default {
  list,
  getOne,
  create,
  update,
  remove,
  progressReport,
  getDocument,
  uploadDocument,
  removeDocument,
  listMilestones,
  createMilestone,
  updateMilestone,
  removeMilestone,
}
