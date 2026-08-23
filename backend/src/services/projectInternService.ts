import projectInternsModel, {
  type ProjectIntern,
  DuplicateAssignmentError,
  InvalidReferenceError,
} from '../models/projectInterns'

export { DuplicateAssignmentError, InvalidReferenceError }

function listByProject(projectId: number): Promise<ProjectIntern[]> {
  return projectInternsModel.findByProject(projectId)
}

function listByIntern(internId: number): Promise<ProjectIntern[]> {
  return projectInternsModel.findByIntern(internId)
}

function assignIntern(
  projectId: number,
  internId: number
): Promise<ProjectIntern> {
  return projectInternsModel.assign(projectId, internId)
}

async function unassignIntern(
  projectId: number,
  internId: number
): Promise<boolean> {
  const deletedCount = await projectInternsModel.unassign(projectId, internId)
  return deletedCount > 0
}

export default {
  listByProject,
  listByIntern,
  assignIntern,
  unassignIntern,
}
