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
    table
      .string('priority', 10)
      .defaultTo('medium')
      .checkIn(['low', 'medium', 'high'])
    table.date('due_date')
    table
      .string('status', 20)
      .notNullable()
      .defaultTo('not_started')
      .checkIn([
        'not_started',
        'in_progress',
        'submitted',
        'approved',
        'rejected',
      ])
    table.integer('created_by').references('id').inTable('users')
    table
      .timestamp('created_at', { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now())
    table
      .timestamp('updated_at', { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now())
    table.index('project_id', 'idx_tasks_project_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('tasks')
}
