import type { Knex } from 'knex'
import knex from '../../db'

export interface NewActivityLog {
  intern_id: number
  actor_id?: number
  action_type: string
  entity_type?: string
  entity_id?: number
  details?: Record<string, unknown>
}

function create(data: NewActivityLog, trx: Knex = knex): Promise<void> {
  return trx('activity_logs')
    .insert(data)
    .then(() => undefined)
}

export default { create }
