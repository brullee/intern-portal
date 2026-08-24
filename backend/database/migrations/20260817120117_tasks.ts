import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('tasks', (table) => {
    table.increments('id')
    table
      .integer('project_id')
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE')
    table.string('title', 200).notNullable()
    table.text('description')
    table.enum('priority', ['low', 'medium', 'high']).defaultTo('medium')
    table.date('due_date')
    table
      .enum('status', [
        'not_started',
        'in_progress',
        'submitted',
        'approved',
        'rejected',
      ])
      .notNullable()
      .defaultTo('not_started')
    table
      .integer('created_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.index('project_id', 'idx_tasks_project_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('tasks')
}
