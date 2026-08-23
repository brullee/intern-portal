import type { Request, Response } from 'express'
import projectInternService, {
  DuplicateAssignmentError,
  InvalidReferenceError,
} from '../services/projectInternService'

async function list(req: Request, res: Response): Promise<void> {
  const projectId = req.query.project_id
    ? Number(req.query.project_id)
    : undefined
  const internId = req.query.intern_id ? Number(req.query.intern_id) : undefined

  if (projectId !== undefined) {
    res.json({
      assignments: await projectInternService.listByProject(projectId),
    })
    return
  }
  if (internId !== undefined) {
    res.json({ assignments: await projectInternService.listByIntern(internId) })
    return
  }
  res
    .status(400)
    .json({ error: 'project_id or intern_id query param is required' })
}

async function assign(req: Request, res: Response): Promise<void> {
  const { project_id, intern_id } = req.body ?? {}
  if (!project_id || !intern_id) {
    res.status(400).json({ error: 'project_id and intern_id are required' })
    return
  }

  try {
    const assignment = await projectInternService.assignIntern(
      Number(project_id),
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

async function unassign(req: Request, res: Response): Promise<void> {
  const projectId = Number(req.params.projectId)
  const internId = Number(req.params.internId)

  const deleted = await projectInternService.unassignIntern(projectId, internId)
  if (!deleted) {
    res.status(404).json({ error: 'Assignment not found' })
    return
  }
  res.status(204).send()
}

export default { list, assign, unassign }
