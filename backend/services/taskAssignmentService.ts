import taskAssignmentsModel, {
  type TaskAssignment,
  DuplicateAssignmentError,
  InvalidReferenceError,
} from '../models/taskAssignments'

export { DuplicateAssignmentError, InvalidReferenceError }

function listByTask(taskId: number): Promise<TaskAssignment[]> {
  return taskAssignmentsModel.findByTask(taskId)
}

function listByIntern(internId: number): Promise<TaskAssignment[]> {
  return taskAssignmentsModel.findByIntern(internId)
}

function assignIntern(
  taskId: number,
  internId: number
): Promise<TaskAssignment> {
  return taskAssignmentsModel.assign(taskId, internId)
}

async function unassignIntern(
  taskId: number,
  internId: number
): Promise<boolean> {
  const deletedCount = await taskAssignmentsModel.unassign(taskId, internId)
  return deletedCount > 0
}

export default {
  listByTask,
  listByIntern,
  assignIntern,
  unassignIntern,
}
