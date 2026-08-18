import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('full_name', 150).notNullable()
    table.string('username', 50).notNullable().unique()
    table.string('email', 150).unique()
    table.string('password_hash', 255).notNullable()
    table.integer('role_id').notNullable().references('id').inTable('roles')
    table.string('phone', 30)
    table.string('avatar_url', 255)
    table.boolean('is_active').notNullable().defaultTo(true)
    table.integer('created_by').references('id').inTable('users')
    table
      .timestamp('created_at', { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now())
    table
      .timestamp('updated_at', { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now())
    table.index('role_id', 'idx_users_role_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('users')
}
