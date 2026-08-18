import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('doctors', (table) => {
    table
      .integer('user_id')
      .primary()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table
      .integer('university_id')
      .notNullable()
      .references('id')
      .inTable('universities')
    table.string('department', 150)
    table.string('title', 100)
    table.index('university_id', 'idx_doctors_university_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('doctors')
}
