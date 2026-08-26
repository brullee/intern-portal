import plansModel, { type Plan } from '../models/plans'
import planMilestonesModel, {
  type PlanMilestone,
} from '../models/planMilestones'
import { ValidationError } from '../errors/AppError'

export { ValidationError }

const VALID_MILESTONE_STATUSES = ['not_started', 'in_progress', 'completed']

export interface PlanMilestoneInput {
  title: string
  due_date?: string
  status?: string
  sort_order?: number
}

function assertValidMilestoneStatus(status: string | undefined): void {
  if (status !== undefined && !VALID_MILESTONE_STATUSES.includes(status)) {
    throw new ValidationError(
      `status must be one of: ${VALID_MILESTONE_STATUSES.join(', ')}`
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

function listPlans(internId?: number): Promise<Plan[]> {
  return internId ? plansModel.findByIntern(internId) : plansModel.findAll()
}

function getPlan(id: number): Promise<Plan | undefined> {
  return plansModel.findById(id)
}

function createPlan(input: PlanInput, createdBy: number): Promise<Plan> {
  assertValid(input)
  return plansModel.create({
    intern_id: input.intern_id,
    title: input.title.trim(),
    description: input.description?.trim(),
    start_date: input.start_date,
    end_date: input.end_date,
    created_by: createdBy,
  })
}

function updatePlan(
  id: number,
  input: Partial<
    Pick<PlanInput, 'title' | 'description' | 'start_date' | 'end_date'>
  >
): Promise<Plan | undefined> {
  if (input.title !== undefined && !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  return plansModel.update(id, input)
}

async function deletePlan(id: number): Promise<boolean> {
  const deletedCount = await plansModel.remove(id)
  return deletedCount > 0
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
  assertValidMilestoneStatus(input.status)
  return planMilestonesModel.create({
    plan_id: planId,
    title: input.title.trim(),
    due_date: input.due_date,
    status: input.status as PlanMilestone['status'] | undefined,
    sort_order: input.sort_order,
  })
}

function updateMilestone(
  id: number,
  input: Partial<PlanMilestoneInput>
): Promise<PlanMilestone | undefined> {
  if (input.title !== undefined && !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  assertValidMilestoneStatus(input.status)
  return planMilestonesModel.update(id, {
    ...input,
    status: input.status as PlanMilestone['status'] | undefined,
  })
}

async function deleteMilestone(id: number): Promise<boolean> {
  const deletedCount = await planMilestonesModel.remove(id)
  return deletedCount > 0
}

export default {
  listPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  listMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
}
