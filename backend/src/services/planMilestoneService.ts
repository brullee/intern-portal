import planMilestonesModel, {
  type PlanMilestone,
} from '../models/planMilestones'

export class ValidationError extends Error {}

const VALID_STATUSES = ['not_started', 'in_progress', 'completed']

export interface PlanMilestoneInput {
  plan_id: number
  title: string
  due_date?: string
  status?: string
  sort_order?: number
}

function assertValidCreate(input: PlanMilestoneInput): void {
  if (!input.plan_id) {
    throw new ValidationError('plan_id is required')
  }
  if (!input.title || !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  assertValidStatus(input.status)
}

function assertValidStatus(status: string | undefined): void {
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    throw new ValidationError(
      `status must be one of: ${VALID_STATUSES.join(', ')}`
    )
  }
}

function listByPlan(planId: number): Promise<PlanMilestone[]> {
  return planMilestonesModel.findByPlan(planId)
}

function createMilestone(input: PlanMilestoneInput): Promise<PlanMilestone> {
  assertValidCreate(input)
  return planMilestonesModel.create({
    plan_id: input.plan_id,
    title: input.title.trim(),
    due_date: input.due_date,
    status: input.status as PlanMilestone['status'] | undefined,
    sort_order: input.sort_order,
  })
}

function updateMilestone(
  id: number,
  input: Partial<
    Pick<PlanMilestoneInput, 'title' | 'due_date' | 'status' | 'sort_order'>
  >
): Promise<PlanMilestone | undefined> {
  if (input.title !== undefined && !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  assertValidStatus(input.status)
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
  listByPlan,
  createMilestone,
  updateMilestone,
  deleteMilestone,
}
