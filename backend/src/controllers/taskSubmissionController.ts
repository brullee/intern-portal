import type { Request, Response } from 'express'
import { NotFoundError } from '../errors/AppError'
import taskSubmissionService, {
  ValidationError,
  InvalidReviewStateError,
} from '../services/taskSubmissionService'

async function listByTask(req: Request, res: Response): Promise<void> {
  const taskId = Number(req.query.task_id)
  if (!taskId) {
    res.status(400).json({ error: 'task_id query param is required' })
    return
  }
  const submissions = await taskSubmissionService.listByTask(taskId)
  res.json({ submissions })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const submission = await taskSubmissionService.getSubmission(id)
  if (!submission) {
    throw new NotFoundError('Submission not found')
  }
  res.json({ submission })
}

// Submits on behalf of the logged-in user — intern_id always comes from the
// session, never the request body, so an intern can only submit as themself.
async function create(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  const files = (req.files as Express.Multer.File[] | undefined) ?? []
  try {
    const submission = await taskSubmissionService.createSubmission(
      {
        task_id: Number(req.body?.task_id),
        note: req.body?.note,
        files,
      },
      req.user.id
    )
    res.status(201).json({ submission })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function review(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  const id = Number(req.params.id)
  const { status, comment } = req.body ?? {}
  if (status !== 'approved' && status !== 'rejected') {
    res.status(400).json({ error: 'status must be "approved" or "rejected"' })
    return
  }
  try {
    const submission = await taskSubmissionService.reviewSubmission(
      id,
      status,
      comment,
      req.user.id
    )
    if (!submission) {
      throw new NotFoundError('Submission not found')
    }
    res.json({ submission })
  } catch (err) {
    if (err instanceof InvalidReviewStateError) {
      res.status(409).json({ error: err.message })
      return
    }
    throw err
  }
}

export default { listByTask, getOne, create, review }
