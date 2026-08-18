import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('roles', (table) => {
    table.increments('id')
    table.string('name', 30).notNullable().unique()
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('roles')
}
