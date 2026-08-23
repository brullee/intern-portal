import type { Request, Response } from 'express'
import planMilestoneService, {
  ValidationError,
} from '../services/planMilestoneService'

async function list(req: Request, res: Response): Promise<void> {
  const planId = Number(req.query.plan_id)
  if (!planId) {
    res.status(400).json({ error: 'plan_id query param is required' })
    return
  }
  const milestones = await planMilestoneService.listByPlan(planId)
  res.json({ milestones })
}

async function create(req: Request, res: Response): Promise<void> {
  try {
    const milestone = await planMilestoneService.createMilestone(req.body ?? {})
    res.status(201).json({ milestone })
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
    const milestone = await planMilestoneService.updateMilestone(
      id,
      req.body ?? {}
    )
    if (!milestone) {
      res.status(404).json({ error: 'Milestone not found' })
      return
    }
    res.json({ milestone })
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
  const deleted = await planMilestoneService.deleteMilestone(id)
  if (!deleted) {
    res.status(404).json({ error: 'Milestone not found' })
    return
  }
  res.status(204).send()
}

export default { list, create, update, remove }
