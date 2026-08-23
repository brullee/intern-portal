import tasksModel, { type Task } from '../models/tasks'

export class ValidationError extends Error {}

const VALID_PRIORITIES = ['low', 'medium', 'high']
const VALID_STATUSES = [
  'not_started',
  'in_progress',
  'submitted',
  'approved',
  'rejected',
]

export interface TaskInput {
  project_id?: number
  title: string
  description?: string
  priority?: string
  due_date?: string
  status?: string
}

function assertValidCreate(input: TaskInput): void {
  if (!input.title || !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  assertValidPriorityAndStatus(input)
}

function assertValidPriorityAndStatus(
  input: Pick<TaskInput, 'priority' | 'status'>
): void {
  if (
    input.priority !== undefined &&
    !VALID_PRIORITIES.includes(input.priority)
  ) {
    throw new ValidationError(
      `priority must be one of: ${VALID_PRIORITIES.join(', ')}`
    )
  }
  if (input.status !== undefined && !VALID_STATUSES.includes(input.status)) {
    throw new ValidationError(
      `status must be one of: ${VALID_STATUSES.join(', ')}`
    )
  }
}

function listTasks(): Promise<Task[]> {
  return tasksModel.findAll()
}

function getTask(id: number): Promise<Task | undefined> {
  return tasksModel.findById(id)
}

function createTask(input: TaskInput, createdBy: number): Promise<Task> {
  assertValidCreate(input)
  return tasksModel.create({
    project_id: input.project_id,
    title: input.title.trim(),
    description: input.description?.trim(),
    priority: input.priority as Task['priority'] | undefined,
    due_date: input.due_date,
    status: input.status as Task['status'] | undefined,
    created_by: createdBy,
  })
}

function updateTask(
  id: number,
  input: Partial<TaskInput>
): Promise<Task | undefined> {
  if (input.title !== undefined && !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  assertValidPriorityAndStatus(input)
  return tasksModel.update(id, {
    ...input,
    priority: input.priority as Task['priority'] | undefined,
    status: input.status as Task['status'] | undefined,
  })
}

async function deleteTask(id: number): Promise<boolean> {
  const deletedCount = await tasksModel.remove(id)
  return deletedCount > 0
}

export default { listTasks, getTask, createTask, updateTask, deleteTask }
