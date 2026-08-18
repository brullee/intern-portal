import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('attendance_sessions', (table) => {
    table.increments('id')
    table
      .integer('intern_id')
      .notNullable()
      .references('user_id')
      .inTable('interns')
      .onDelete('CASCADE')
    table.timestamp('clock_in').notNullable()
    table.timestamp('clock_out')
    table.boolean('auto_closed').notNullable().defaultTo(false)
    table.text('notes')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index('intern_id', 'idx_attendance_sessions_intern_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('attendance_sessions')
}
