import type { Request, Response } from 'express'
import meService from '../services/meService'
import { parsePagination } from '../utils/pagination'

async function getProfile(req: Request, res: Response): Promise<void> {
  const profile = await meService.getProfile(req.user!.id)
  if (!profile) {
    res.status(404).json({ error: 'Intern profile not found' })
    return
  }
  res.json({ profile })
}

async function listProjects(req: Request, res: Response): Promise<void> {
  const projects = await meService.listProjects(req.user!.id)
  res.json({ projects })
}

async function listTasks(req: Request, res: Response): Promise<void> {
  const result = await meService.listTasks(req.user!.id, parsePagination(req))
  res.json(result)
}

async function listSubmissions(req: Request, res: Response): Promise<void> {
  const submissions = await meService.listSubmissions(req.user!.id)
  res.json({ submissions })
}

async function listPlans(req: Request, res: Response): Promise<void> {
  const plans = await meService.listPlans(req.user!.id)
  res.json({ plans })
}

export default {
  getProfile,
  listProjects,
  listTasks,
  listSubmissions,
  listPlans,
}
