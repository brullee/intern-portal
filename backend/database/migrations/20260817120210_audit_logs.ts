import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('audit_logs', (table) => {
    table.increments('id')
    table
      .integer('actor_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
    table.string('action', 50).notNullable()
    table.string('entity_type', 50).notNullable()
    table.integer('entity_id')
    table.jsonb('diff')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index('created_at', 'idx_audit_logs_created_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('audit_logs')
}
