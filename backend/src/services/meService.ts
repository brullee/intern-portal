import internsModel, { type InternWithUser } from '../models/interns'
import projectsModel, { type Project } from '../models/projects'
import taskAssignmentsModel from '../models/taskAssignments'
import taskSubmissionsModel, {
  type TaskSubmission,
} from '../models/taskSubmissions'
import plansModel, { type Plan } from '../models/plans'
import planMilestonesModel, {
  type PlanMilestone,
} from '../models/planMilestones'
import storageService from './storageService'
import planService, { progressPercent } from './planService'
import { PaginationParams, paginatedResponse } from '../utils/pagination'

// All lookups key on the caller's user id, which is also the interns PK
// (interns.user_id) and the FK target for project/task/plan links — so an
// intern only ever sees their own rows.

function getProfile(userId: number): Promise<InternWithUser | undefined> {
  return internsModel.findById(userId)
}

function listProjects(userId: number): Promise<Project[]> {
  return projectsModel.findByIntern(userId)
}

async function listTasks(userId: number, pagination: PaginationParams) {
  const { rows, total } = await taskAssignmentsModel.listTasksForIntern(
    userId,
    pagination
  )
  return paginatedResponse(rows, total, pagination)
}

// file_url holds one or more comma-separated stored URLs; swap each for a
// short-lived presigned download URL so the intern can fetch their own files.
async function withSignedUrls(
  submission: TaskSubmission
): Promise<TaskSubmission> {
  if (!submission.file_url) return submission
  const signedUrls = await Promise.all(
    submission.file_url
      .split(',')
      .map((url) => storageService.GetFilefromS3(url))
  )
  return { ...submission, file_url: signedUrls.join(',') }
}

async function listSubmissions(userId: number): Promise<TaskSubmission[]> {
  const submissions = await taskSubmissionsModel.findByIntern(userId)
  return Promise.all(submissions.map(withSignedUrls))
}

interface PlanWithMilestones extends Plan {
  milestones: PlanMilestone[]
  progress: number
}

async function listPlans(userId: number): Promise<PlanWithMilestones[]> {
  const plans = await plansModel.findByIntern(userId)
  return Promise.all(
    plans.map(async (plan) => {
      const milestones = await planMilestonesModel.findByPlan(plan.id)
      const completed = milestones.filter(
        (m) => m.status === 'completed'
      ).length
      return {
        ...plan,
        milestones,
        progress: progressPercent(milestones.length, completed),
        document_url: plan.document_url
          ? await storageService.GetFilefromS3(plan.document_url)
          : null,
      }
    })
  )
}

function updateMilestoneStatus(
  userId: number,
  planId: number,
  milestoneId: number,
  status: string | undefined
): Promise<PlanMilestone> {
  return planService.setMilestoneStatusForIntern(
    userId,
    planId,
    milestoneId,
    status
  )
}

export default {
  getProfile,
  listProjects,
  listTasks,
  updateMilestoneStatus,
  listSubmissions,
  listPlans,
}
