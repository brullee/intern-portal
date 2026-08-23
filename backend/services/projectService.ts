import projectsModel, { type Project } from '../models/projects'

export class ValidationError extends Error {}

const VALID_STATUSES = ['active', 'on_hold', 'completed', 'cancelled']

export interface ProjectInput {
  name: string
  description?: string
  start_date?: string
  end_date?: string
  status?: string
}

function assertValid(input: ProjectInput): void {
  if (!input.name || !input.name.trim()) {
    throw new ValidationError('name is required')
  }
  if (input.status !== undefined && !VALID_STATUSES.includes(input.status)) {
    throw new ValidationError(
      `status must be one of: ${VALID_STATUSES.join(', ')}`
    )
  }
}

function listProjects(): Promise<Project[]> {
  return projectsModel.findAll()
}

function getProject(id: number): Promise<Project | undefined> {
  return projectsModel.findById(id)
}

function createProject(
  input: ProjectInput,
  createdBy: number
): Promise<Project> {
  assertValid(input)
  return projectsModel.create({
    name: input.name.trim(),
    description: input.description?.trim(),
    start_date: input.start_date,
    end_date: input.end_date,
    status: input.status as Project['status'] | undefined,
    created_by: createdBy,
  })
}

function updateProject(
  id: number,
  input: Partial<ProjectInput>
): Promise<Project | undefined> {
  if (input.name !== undefined && !input.name.trim()) {
    throw new ValidationError('name is required')
  }
  if (input.status !== undefined && !VALID_STATUSES.includes(input.status)) {
    throw new ValidationError(
      `status must be one of: ${VALID_STATUSES.join(', ')}`
    )
  }
  return projectsModel.update(id, {
    ...input,
    status: input.status as Project['status'] | undefined,
  })
}

async function deleteProject(id: number): Promise<boolean> {
  const deletedCount = await projectsModel.remove(id)
  return deletedCount > 0
}

export default {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
}
