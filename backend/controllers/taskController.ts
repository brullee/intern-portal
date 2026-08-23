import type { Request, Response } from 'express'
import taskService, { ValidationError } from '../services/taskService'

async function list(req: Request, res: Response): Promise<void> {
  const tasks = await taskService.listTasks()
  res.json({ tasks })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const task = await taskService.getTask(id)
  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  res.json({ task })
}

async function create(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  try {
    const task = await taskService.createTask(req.body ?? {}, req.user.id)
    res.status(201).json({ task })
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
    const task = await taskService.updateTask(id, req.body ?? {})
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }
    res.json({ task })
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
  const deleted = await taskService.deleteTask(id)
  if (!deleted) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  res.status(204).send()
}

export default { list, getOne, create, update, remove }
