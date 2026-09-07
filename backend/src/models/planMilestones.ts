import knex from '../../db'

export const MILESTONE_STATUSES = [
  'not_started',
  'in_progress',
  'completed',
] as const

export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number]

export interface PlanMilestone {
  id: number
  plan_id: number
  title: string
  due_date: string | null
  status: MilestoneStatus
  sort_order: number | null
}

export interface NewPlanMilestone {
  plan_id: number
  title: string
  due_date?: string
  status?: PlanMilestone['status']
  sort_order?: number
}

export interface PlanMilestoneCounts {
  plan_id: number
  total: number
  completed: number
}

async function countsByPlan(planIds: number[]): Promise<PlanMilestoneCounts[]> {
  if (planIds.length === 0) return []
  return knex('plan_milestones')
    .whereIn('plan_id', planIds)
    .groupBy('plan_id')
    .select<PlanMilestoneCounts[]>(
      'plan_id',
      knex.raw('COUNT(*)::int AS total'),
      knex.raw("COUNT(*) FILTER (WHERE status = 'completed')::int AS completed")
    )
}

function findByPlan(planId: number): Promise<PlanMilestone[]> {
  return knex<PlanMilestone>('plan_milestones')
    .where({ plan_id: planId })
    .orderBy('sort_order')
}

function findById(id: number): Promise<PlanMilestone | undefined> {
  return knex<PlanMilestone>('plan_milestones').where({ id }).first()
}

async function create(data: NewPlanMilestone): Promise<PlanMilestone> {
  const [milestone] = await knex<PlanMilestone>('plan_milestones')
    .insert(data)
    .returning('*')
  return milestone
}

async function update(
  id: number,
  data: Partial<NewPlanMilestone>
): Promise<PlanMilestone | undefined> {
  const [milestone] = await knex<PlanMilestone>('plan_milestones')
    .where({ id })
    .update(data)
    .returning('*')
  return milestone
}

function remove(id: number): Promise<number> {
  return knex<PlanMilestone>('plan_milestones').where({ id }).del()
}

export default { countsByPlan, findByPlan, findById, create, update, remove }
