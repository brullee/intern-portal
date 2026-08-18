import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('conversations', (table) => {
    table.increments('id')
    table
      .string('type', 20)
      .notNullable()
      .defaultTo('direct')
      .checkIn(['direct', 'group'])
    table
      .timestamp('created_at', { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('conversations')
}
