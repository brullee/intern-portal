import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('permissions', (table) => {
    table.increments('id')
    table.string('key', 60).notNullable().unique()
    table.string('description', 255)
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('permissions')
}
