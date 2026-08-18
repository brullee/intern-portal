import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('mentors', (table) => {
    table
      .integer('user_id')
      .primary()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.string('department', 150)
    table.string('title', 100)
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('mentors')
}
