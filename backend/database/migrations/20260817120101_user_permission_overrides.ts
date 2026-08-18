import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('user_permission_overrides', (table) => {
    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table
      .integer('permission_id')
      .notNullable()
      .references('id')
      .inTable('permissions')
      .onDelete('CASCADE')
    table.string('effect', 6).notNullable().checkIn(['grant', 'revoke'])
    table.integer('granted_by').references('id').inTable('users')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.primary(['user_id', 'permission_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('user_permission_overrides')
}
