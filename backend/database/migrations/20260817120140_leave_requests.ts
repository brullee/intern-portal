import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('leave_requests', (table) => {
    table.increments('id')
    table
      .integer('intern_id')
      .notNullable()
      .references('user_id')
      .inTable('interns')
      .onDelete('CASCADE')
    table.date('start_date').notNullable()
    table.date('end_date').notNullable()
    table.text('reason')
    table
      .enum('status', ['pending', 'approved', 'rejected'])
      .notNullable()
      .defaultTo('pending')
    table
      .integer('reviewed_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('leave_requests')
}
