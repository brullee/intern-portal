import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('plans', (table) => {
    table.increments('id')
    table
      .integer('intern_id')
      .notNullable()
      .references('user_id')
      .inTable('interns')
      .onDelete('CASCADE')
    table.string('title', 150).notNullable()
    table.text('description')
    table.date('start_date')
    table.date('end_date')
    table.integer('created_by').references('id').inTable('users')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index('intern_id', 'idx_plans_intern_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('plans')
}
