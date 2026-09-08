import plansModel, { type Plan } from '../models/plans'
import planMilestonesModel, {
  type PlanMilestone,
  type MilestoneStatus,
  MILESTONE_STATUSES,
} from '../models/planMilestones'
import internsModel from '../models/interns'
import { ValidationError } from '../errors/AppError'
import {
  PlanNotFoundError,
  MilestoneNotFoundError,
  PlanNotOwnedError,
  PlanDocumentNotFoundError,
} from '../errors/planErrors'
import storageService from './storageService'
import { PaginationParams, paginatedResponse } from '../utils/pagination'

export { ValidationError, PlanNotFoundError }

export interface PlanWithProgress extends Plan {
  progress: number
}

export function progressPercent(total: number, completed: number): number {
  if (total <= 0) return 0
  return Math.round((completed / total) * 100)
}

async function attachProgress(plans: Plan[]): Promise<PlanWithProgress[]> {
  const counts = await planMilestonesModel.countsByPlan(plans.map((p) => p.id))
  const byPlan = new Map(counts.map((c) => [c.plan_id, c]))
  return plans.map((plan) => {
    const c = byPlan.get(plan.id)
    return {
      ...plan,
      progress: progressPercent(c?.total ?? 0, c?.completed ?? 0),
    }
  })
}

export interface PlanMilestoneInput {
  title: string
  due_date?: string
  status?: string
  sort_order?: number
}

export function assertMilestoneStatus(
  status: string | undefined
): asserts status is MilestoneStatus | undefined {
  if (
    status !== undefined &&
    !MILESTONE_STATUSES.includes(status as MilestoneStatus)
  ) {
    throw new ValidationError(
      `status must be one of: ${MILESTONE_STATUSES.join(', ')}`
    )
  }
}

export interface PlanInput {
  intern_id: number
  title: string
  description?: string
  start_date?: string
  end_date?: string
}

function assertValid(input: PlanInput): void {
  if (!input.intern_id) {
    throw new ValidationError('intern_id is required')
  }
  if (!input.title || !input.title.trim()) {
    throw new ValidationError('title is required')
  }
}

async function assertInternExists(internId: number): Promise<void> {
  const intern = await internsModel.findById(internId)
  if (!intern) {
    throw new ValidationError('intern_id does not match an intern')
  }
}

async function listPlans(internId?: number): Promise<PlanWithProgress[]> {
  const plans = internId
    ? await plansModel.findByIntern(internId)
    : await plansModel.findAll()
  return attachProgress(plans)
}

export async function listPlansForIntern(
  internId: number,
  pagination: PaginationParams
) {
  const { rows, total } = await plansModel.listPaginatedByIntern(
    internId,
    pagination
  )
  return paginatedResponse(await attachProgress(rows), total, pagination)
}

async function getPlan(id: number): Promise<PlanWithProgress | undefined> {
  const plan = await plansModel.findById(id)
  if (!plan) return undefined
  const [withProgress] = await attachProgress([plan])
  return withProgress
}

export interface PlanProgressReportRow {
  plan_id: number
  intern_name: string
  title: string
  start_date: string | null
  end_date: string | null
  progress: number
}

async function getProgressReport(): Promise<PlanProgressReportRow[]> {
  const plans = await plansModel.findAllWithInternName()
  const counts = await planMilestonesModel.countsByPlan(plans.map((p) => p.id))
  const byPlan = new Map(counts.map((c) => [c.plan_id, c]))
  return plans.map((plan) => {
    const c = byPlan.get(plan.id)
    return {
      plan_id: plan.id,
      intern_name: plan.intern_name,
      title: plan.title,
      start_date: plan.start_date,
      end_date: plan.end_date,
      progress: progressPercent(c?.total ?? 0, c?.completed ?? 0),
    }
  })
}

async function createPlan(input: PlanInput, createdBy: number): Promise<Plan> {
  assertValid(input)
  await assertInternExists(input.intern_id)
  return plansModel.create({
    intern_id: input.intern_id,
    title: input.title.trim(),
    description: input.description?.trim(),
    start_date: input.start_date,
    end_date: input.end_date,
    created_by: createdBy,
  })
}

async function updatePlan(
  id: number,
  input: Partial<
    Pick<
      PlanInput,
      'intern_id' | 'title' | 'description' | 'start_date' | 'end_date'
    >
  >
): Promise<Plan | undefined> {
  if (input.title !== undefined && !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  if (input.intern_id !== undefined) {
    await assertInternExists(input.intern_id)
  }
  return plansModel.update(id, input)
}

async function deletePlan(id: number): Promise<boolean> {
  const deletedCount = await plansModel.remove(id)
  return deletedCount > 0
}

async function requirePlan(id: number): Promise<Plan> {
  const plan = await plansModel.findById(id)
  if (!plan) throw new PlanNotFoundError()
  return plan
}

async function requireMilestone(
  planId: number,
  milestoneId: number
): Promise<PlanMilestone> {
  const milestone = await planMilestonesModel.findById(milestoneId)
  if (!milestone || milestone.plan_id !== planId) {
    throw new MilestoneNotFoundError()
  }
  return milestone
}

async function setPlanDocument(
  id: number,
  file: Express.Multer.File
): Promise<Plan> {
  await requirePlan(id)
  const [url] = await storageService.uploadFiletoS3([file])
  const updated = await plansModel.setDocument(id, {
    document_url: url,
    document_name: file.originalname,
  })
  return updated as Plan
}

async function clearPlanDocument(id: number): Promise<Plan> {
  await requirePlan(id)
  const updated = await plansModel.setDocument(id, {
    document_url: null,
    document_name: null,
  })
  return updated as Plan
}

async function getPlanDocumentUrl(id: number): Promise<string> {
  const plan = await requirePlan(id)
  if (!plan.document_url) throw new PlanDocumentNotFoundError()
  return storageService.GetFilefromS3(plan.document_url)
}

function listMilestones(planId: number): Promise<PlanMilestone[]> {
  return planMilestonesModel.findByPlan(planId)
}

function createMilestone(
  planId: number,
  input: PlanMilestoneInput
): Promise<PlanMilestone> {
  if (!input.title || !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  assertMilestoneStatus(input.status)
  return planMilestonesModel.create({
    plan_id: planId,
    title: input.title.trim(),
    due_date: input.due_date,
    status: input.status,
    sort_order: input.sort_order,
  })
}

async function updateMilestone(
  planId: number,
  milestoneId: number,
  input: Partial<PlanMilestoneInput>
): Promise<PlanMilestone> {
  if (input.title !== undefined && !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  assertMilestoneStatus(input.status)
  await requireMilestone(planId, milestoneId)
  const updated = await planMilestonesModel.update(milestoneId, {
    ...input,
    status: input.status,
  })
  return updated as PlanMilestone
}

async function deleteMilestone(
  planId: number,
  milestoneId: number
): Promise<void> {
  await requireMilestone(planId, milestoneId)
  await planMilestonesModel.remove(milestoneId)
}

async function setMilestoneStatusForIntern(
  internId: number,
  planId: number,
  milestoneId: number,
  status: string | undefined
): Promise<PlanMilestone> {
  assertMilestoneStatus(status)
  if (status === undefined) {
    throw new ValidationError('status is required')
  }
  const plan = await requirePlan(planId)
  if (plan.intern_id !== internId) throw new PlanNotOwnedError()
  await requireMilestone(planId, milestoneId)
  const updated = await planMilestonesModel.update(milestoneId, { status })
  return updated as PlanMilestone
}

export default {
  listPlans,
  getPlan,
  getProgressReport,
  createPlan,
  updatePlan,
  deletePlan,
  setPlanDocument,
  clearPlanDocument,
  getPlanDocumentUrl,
  listMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  setMilestoneStatusForIntern,
}
