import knex from '../../db'
import type { PaginationParams } from '../utils/pagination'

export interface Plan {
  id: number
  intern_id: number
  title: string
  description: string | null
  start_date: string | null
  end_date: string | null
  created_by: number | null
  created_at: Date
}

export interface NewPlan {
  intern_id: number
  title: string
  description?: string
  start_date?: string
  end_date?: string
  created_by?: number
}

function findAll(): Promise<Plan[]> {
  return knex<Plan>('plans').orderBy('created_at', 'desc')
}

function findByIntern(internId: number): Promise<Plan[]> {
  return knex<Plan>('plans')
    .where({ intern_id: internId })
    .orderBy('created_at', 'desc')
}

async function listPaginatedByIntern(
  internId: number,
  pagination: PaginationParams
): Promise<{ rows: Plan[]; total: number }> {
  const base = knex<Plan>('plans').where({ intern_id: internId })
  const countQuery = base.clone()
  const rows = await base
    .orderBy('created_at', 'desc')
    .limit(pagination.limit)
    .offset(pagination.offset)
  const [{ count }] = await countQuery.count<{ count: string }[]>('* as count')
  return { rows, total: Number(count) }
}

function findById(id: number): Promise<Plan | undefined> {
  return knex<Plan>('plans').where({ id }).first()
}

async function create(data: NewPlan): Promise<Plan> {
  const [plan] = await knex<Plan>('plans').insert(data).returning('*')
  return plan
}

async function update(
  id: number,
  data: Partial<NewPlan>
): Promise<Plan | undefined> {
  const [plan] = await knex<Plan>('plans')
    .where({ id })
    .update(data)
    .returning('*')
  return plan
}

function remove(id: number): Promise<number> {
  return knex<Plan>('plans').where({ id }).del()
}

export default {
  findAll,
  findByIntern,
  listPaginatedByIntern,
  findById,
  create,
  update,
  remove,
}
