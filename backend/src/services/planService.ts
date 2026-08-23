import plansModel, { type Plan } from '../models/plans'

export class ValidationError extends Error {}

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

export default { listPlans, getPlan, createPlan, updatePlan, deletePlan }
