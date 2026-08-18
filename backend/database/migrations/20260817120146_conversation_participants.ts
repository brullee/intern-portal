import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('conversation_participants', (table) => {
    table
      .integer('conversation_id')
      .notNullable()
      .references('id')
      .inTable('conversations')
      .onDelete('CASCADE')
    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.timestamp('joined_at').notNullable().defaultTo(knex.fn.now())
    table.primary(['conversation_id', 'user_id'])
    table.index('user_id', 'idx_conversation_participants_uid')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('conversation_participants')
}
