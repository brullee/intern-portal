import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('activity_logs', (table) => {
    table.increments('id')
    table
      .integer('intern_id')
      .references('user_id')
      .inTable('interns')
      .onDelete('CASCADE')
    table
      .integer('actor_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
    table.string('action_type', 50).notNullable()
    table.string('entity_type', 50)
    table.integer('entity_id')
    table.jsonb('details')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index('intern_id', 'idx_activity_logs_intern_id')
    table.index('created_at', 'idx_activity_logs_created_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('activity_logs')
}
