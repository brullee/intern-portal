import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('role_permissions', (table) => {
    table
      .integer('role_id')
      .notNullable()
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE')
    table
      .integer('permission_id')
      .notNullable()
      .references('id')
      .inTable('permissions')
      .onDelete('CASCADE')
    table.primary(['role_id', 'permission_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('role_permissions')
}
