import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('messages', (table) => {
    table.increments('id')
    table
      .integer('conversation_id')
      .notNullable()
      .references('id')
      .inTable('conversations')
      .onDelete('CASCADE')
    table.integer('sender_id').notNullable().references('id').inTable('users')
    table.text('body')
    table.string('attachment_url', 255)
    table
      .timestamp('sent_at', { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now())
    table.index('conversation_id', 'idx_messages_conversation_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('messages')
}
