import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('task_assignments', (table) => {
    table
      .integer('task_id')
      .notNullable()
      .references('id')
      .inTable('tasks')
      .onDelete('CASCADE')
    table
      .integer('intern_id')
      .notNullable()
      .references('user_id')
      .inTable('interns')
      .onDelete('CASCADE')
    table.timestamp('assigned_at').notNullable().defaultTo(knex.fn.now())
    table.primary(['task_id', 'intern_id'])
    table.index('intern_id', 'idx_task_assignments_intern_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('task_assignments')
}
