import knex from '../../db'

export interface PlanMilestone {
  id: number
  plan_id: number
  title: string
  due_date: string | null
  status: 'not_started' | 'in_progress' | 'completed'
  sort_order: number | null
}

export interface NewPlanMilestone {
  plan_id: number
  title: string
  due_date?: string
  status?: PlanMilestone['status']
  sort_order?: number
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

export default { findByPlan, findById, create, update, remove }
