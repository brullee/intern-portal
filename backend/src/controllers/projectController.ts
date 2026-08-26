import type { Request, Response } from 'express'
import projectService, {
  ValidationError,
  DuplicateAssignmentError,
  InvalidReferenceError,
} from '../services/projectService'

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

async function listInterns(req: Request, res: Response): Promise<void> {
  const projectId = Number(req.params.id)
  res.json({ interns: await projectService.listInterns(projectId) })
}

async function assignIntern(req: Request, res: Response): Promise<void> {
  const projectId = Number(req.params.id)
  const { intern_id } = req.body ?? {}
  if (!intern_id) {
    res.status(400).json({ error: 'intern_id is required' })
    return
  }

  try {
    const assignment = await projectService.assignIntern(
      projectId,
      Number(intern_id)
    )
    res.status(201).json({ assignment })
  } catch (err) {
    if (err instanceof DuplicateAssignmentError) {
      res
        .status(409)
        .json({ error: 'Intern is already assigned to this project' })
      return
    }
    if (err instanceof InvalidReferenceError) {
      res.status(400).json({ error: 'project_id or intern_id does not exist' })
      return
    }
    throw err
  }
}

async function removeIntern(req: Request, res: Response): Promise<void> {
  const projectId = Number(req.params.id)
  const internId = Number(req.params.internId)

  const deleted = await projectService.removeIntern(projectId, internId)
  if (!deleted) {
    res.status(404).json({ error: 'Assignment not found' })
    return
  }
  res.status(204).send()
}

export default {
  list,
  getOne,
  create,
  update,
  remove,
  listInterns,
  assignIntern,
  removeIntern,
}
