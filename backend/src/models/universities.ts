import knex from '../../db'
import type { PaginationParams } from '../utils/pagination'

export interface University {
  id: number
  name: string
  country: string | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface NewUniversity {
  name: string
  country?: string | null
}

function findAll(): Promise<University[]> {
  return knex<University>('universities').orderBy('name')
}

function findById(id: number): Promise<University | undefined> {
  return knex<University>('universities').where({ id }).first()
}

async function list(
  pagination: PaginationParams,
  filters: { includeInactive?: boolean } = {}
): Promise<{ rows: University[]; total: number }> {
  const base = knex<University>('universities')
  if (!filters.includeInactive) {
    base.where({ is_active: true })
  }

  const countQuery = base.clone()
  const rows = await base
    .orderBy('name')
    .limit(pagination.limit)
    .offset(pagination.offset)
  const [{ count }] = await countQuery.count<{ count: string }[]>('* as count')
  return { rows, total: Number(count) }
}

async function create(data: NewUniversity): Promise<University> {
  const [university] = await knex<University>('universities')
    .insert(data)
    .returning('*')
  return university
}

async function update(
  id: number,
  data: Partial<NewUniversity>
): Promise<University | undefined> {
  const [university] = await knex<University>('universities')
    .where({ id })
    .update({ ...data, updated_at: knex.fn.now() })
    .returning('*')
  return university
}

function setActive(id: number, isActive: boolean): Promise<number> {
  return knex<University>('universities')
    .where({ id })
    .update({ is_active: isActive, updated_at: knex.fn.now() })
}

export default { findAll, findById, list, create, update, setActive }
