import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('universities', (table) => {
    table.increments('id')
    table.string('name', 150).notNullable()
    table.string('country', 100)
    table.boolean('is_active').notNullable().defaultTo(true)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('universities')
}
