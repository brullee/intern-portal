import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('conversations', (table) => {
    table.increments('id')
    table.enum('type', ['direct', 'group']).notNullable().defaultTo('direct')
    table.string('name', 100)
    table.integer('created_by').references('id').inTable('users')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('conversations')
}
