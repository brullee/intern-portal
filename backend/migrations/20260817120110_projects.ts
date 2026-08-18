import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('projects', (table) => {
    table.increments('id')
    table.string('name', 150).notNullable()
    table.text('description')
    table.date('start_date')
    table.date('end_date')
    table
      .string('status', 20)
      .notNullable()
      .defaultTo('active')
      .checkIn(['active', 'on_hold', 'completed', 'cancelled'])
    table.integer('created_by').references('id').inTable('users')
    table
      .timestamp('created_at', { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now())
    table
      .timestamp('updated_at', { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('projects')
}
