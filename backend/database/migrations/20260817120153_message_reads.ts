import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('message_reads', (table) => {
    table
      .integer('message_id')
      .notNullable()
      .references('id')
      .inTable('messages')
      .onDelete('CASCADE')
    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.timestamp('read_at').notNullable().defaultTo(knex.fn.now())
    table.primary(['message_id', 'user_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('message_reads')
}
