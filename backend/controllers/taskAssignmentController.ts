import type { Request, Response } from 'express'
import taskAssignmentService, {
  DuplicateAssignmentError,
  InvalidReferenceError,
} from '../services/taskAssignmentService'

async function list(req: Request, res: Response): Promise<void> {
  const taskId = req.query.task_id ? Number(req.query.task_id) : undefined
  const internId = req.query.intern_id ? Number(req.query.intern_id) : undefined

  if (taskId !== undefined) {
    res.json({ assignments: await taskAssignmentService.listByTask(taskId) })
    return
  }
  if (internId !== undefined) {
    res.json({
      assignments: await taskAssignmentService.listByIntern(internId),
    })
    return
  }
  res
    .status(400)
    .json({ error: 'task_id or intern_id query param is required' })
}

async function assign(req: Request, res: Response): Promise<void> {
  const { task_id, intern_id } = req.body ?? {}
  if (!task_id || !intern_id) {
    res.status(400).json({ error: 'task_id and intern_id are required' })
    return
  }

  try {
    const assignment = await taskAssignmentService.assignIntern(
      Number(task_id),
      Number(intern_id)
    )
    res.status(201).json({ assignment })
  } catch (err) {
    if (err instanceof DuplicateAssignmentError) {
      res.status(409).json({ error: 'Intern is already assigned to this task' })
      return
    }
    if (err instanceof InvalidReferenceError) {
      res.status(400).json({ error: 'task_id or intern_id does not exist' })
      return
    }
    throw err
  }
}

async function unassign(req: Request, res: Response): Promise<void> {
  const taskId = Number(req.params.taskId)
  const internId = Number(req.params.internId)

  const deleted = await taskAssignmentService.unassignIntern(taskId, internId)
  if (!deleted) {
    res.status(404).json({ error: 'Assignment not found' })
    return
  }
  res.status(204).send()
}

export default { list, assign, unassign }
