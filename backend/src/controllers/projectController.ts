import type { Request, Response } from 'express'
import projectService, { ValidationError } from '../services/projectService'

async function list(req: Request, res: Response): Promise<void> {
  const projects = await projectService.listProjects()
  res.json({ projects })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const project = await projectService.getProject(id)
  if (!project) {
    res.status(404).json({ error: 'Project not found' })
    return
  }
  res.json({ project })
}

async function create(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  try {
    const project = await projectService.createProject(
      req.body ?? {},
      req.user.id
    )
    res.status(201).json({ project })
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
    const project = await projectService.updateProject(id, req.body ?? {})
    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }
    res.json({ project })
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
  const deleted = await projectService.deleteProject(id)
  if (!deleted) {
    res.status(404).json({ error: 'Project not found' })
    return
  }
  res.status(204).send()
}

export default { list, getOne, create, update, remove }
