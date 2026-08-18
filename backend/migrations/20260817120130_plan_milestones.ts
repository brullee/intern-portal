import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('plan_milestones', (table) => {
    table.increments('id')
    table
      .integer('plan_id')
      .notNullable()
      .references('id')
      .inTable('plans')
      .onDelete('CASCADE')
    table.string('title', 200).notNullable()
    table.date('due_date')
    table
      .string('status', 20)
      .notNullable()
      .defaultTo('not_started')
      .checkIn(['not_started', 'in_progress', 'completed'])
    table.integer('sort_order').defaultTo(0)
    table.index('plan_id', 'idx_plan_milestones_plan_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('plan_milestones')
}
