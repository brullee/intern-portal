import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('task_submissions', (table) => {
    table.increments('id')
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
    table.text('note')
    table.string('file_url', 255)
    table
      .timestamp('submitted_at', { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now())
    table.integer('reviewed_by').references('id').inTable('users')
    table
      .string('review_status', 20)
      .defaultTo('pending')
      .checkIn(['pending', 'approved', 'rejected'])
    table.text('review_comment')
    table.timestamp('reviewed_at', { useTz: false })
    table.index('task_id', 'idx_task_submissions_task_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('task_submissions')
}
